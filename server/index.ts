import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { spawn } from "child_process";
import { createProxyMiddleware } from "http-proxy-middleware";
import { generateOTP, sendOTP } from "./twilioClient";

const app = express();
const httpServer = createServer(app);

// Start FastAPI backend
const fastApiProcess = spawn("python", ["-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  detached: false,
});

fastApiProcess.stdout?.on("data", (data) => {
  console.log(`[fastapi] ${data.toString().trim()}`);
});

fastApiProcess.stderr?.on("data", (data) => {
  console.error(`[fastapi] ${data.toString().trim()}`);
});

fastApiProcess.on("error", (error) => {
  console.error(`[fastapi] Failed to start: ${error.message}`);
});

process.on("exit", () => {
  fastApiProcess.kill();
});

import crypto from "crypto";

// OTP storage (in-memory, expires after 5 minutes)
const otpStore: Map<string, { otp: string; expiresAt: number; userId?: string }> = new Map();

// Verified phone tokens (valid for 10 minutes after OTP verification)
const verifiedPhoneTokens: Map<string, { phone: string; expiresAt: number }> = new Map();

// Generate a secure verification token
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Clean up expired OTPs and tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(phone);
    }
  }
  for (const [token, data] of verifiedPhoneTokens.entries()) {
    if (data.expiresAt < now) {
      verifiedPhoneTokens.delete(token);
    }
  }
}, 60000); // Check every minute

// OTP endpoints - must be before proxy and need body parsing
app.use("/api/otp", express.json());

// Send OTP endpoint
app.post("/api/otp/send", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    // Store OTP
    otpStore.set(phone, { otp, expiresAt });
    
    // Send OTP via Twilio
    const success = await sendOTP(phone, otp);
    
    if (!success) {
      return res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
    
    log(`OTP sent to ${phone.substring(0, 4)}****`);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP endpoint - returns a verification token
app.post("/api/otp/verify", async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    
    const stored = otpStore.get(phone);
    
    if (!stored) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }
    
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
    
    // OTP verified successfully - clean up OTP and generate verification token
    otpStore.delete(phone);
    
    // Generate a verification token that must be used to complete phone login
    const verificationToken = generateVerificationToken();
    const tokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    verifiedPhoneTokens.set(verificationToken, { phone, expiresAt: tokenExpiresAt });
    
    log(`OTP verified for ${phone.substring(0, 4)}****, token issued`);
    return res.json({ 
      success: true, 
      message: "Phone verified successfully",
      phone: phone,
      verificationToken: verificationToken
    });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
});

// Phone authentication endpoint - requires verification token from OTP flow
app.use("/api/auth/phone", express.json());
app.post("/api/auth/phone", async (req: Request, res: Response) => {
  try {
    const { verificationToken, name } = req.body;
    
    if (!verificationToken) {
      return res.status(400).json({ message: "Verification token is required. Please verify your phone first." });
    }
    
    // Validate the verification token
    const tokenData = verifiedPhoneTokens.get(verificationToken);
    
    if (!tokenData) {
      return res.status(401).json({ message: "Invalid or expired verification token. Please verify your phone again." });
    }
    
    if (tokenData.expiresAt < Date.now()) {
      verifiedPhoneTokens.delete(verificationToken);
      return res.status(401).json({ message: "Verification token expired. Please verify your phone again." });
    }
    
    const phone = tokenData.phone;
    
    // Forward to FastAPI with verified phone - include a special header to indicate verified request
    const fastApiResponse = await fetch("http://localhost:8000/api/auth/phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Phone-Verified": "true"
      },
      body: JSON.stringify({ phone, name })
    });
    
    const data = await fastApiResponse.json();
    
    if (!fastApiResponse.ok) {
      return res.status(fastApiResponse.status).json(data);
    }
    
    // Only clean up token after successful login (not for new user detection)
    // If isNewUser is true and no name was provided, keep the token for the follow-up call
    if (!data.isNewUser || name) {
      verifiedPhoneTokens.delete(verificationToken);
    }
    
    // Forward cookies from FastAPI response
    const setCookie = fastApiResponse.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }
    
    log(`Phone login completed for ${phone.substring(0, 4)}****`);
    return res.json(data);
  } catch (error: any) {
    console.error("Error in phone auth:", error);
    return res.status(500).json({ message: "Failed to complete phone authentication" });
  }
});

// IMPORTANT: Register API proxy BEFORE body parsers to preserve raw body stream
// This must be done before express.json() parses the request body
const apiProxy = createProxyMiddleware({
  target: "http://localhost:8000/api",
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      console.log(`[proxy] ${req.method} /api${req.url} -> http://localhost:8000/api${req.url}`);
    },
    error: (err, req, res) => {
      console.error(`[proxy] Error: ${err.message}`);
    }
  }
});

app.use("/api", apiProxy);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Body parsers AFTER proxy to avoid consuming the request body before proxying
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();

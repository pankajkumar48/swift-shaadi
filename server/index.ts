import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { spawn } from "child_process";
import { createProxyMiddleware } from "http-proxy-middleware";
import { setupAuth } from "./replitAuth";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

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

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

(async () => {
  // Set up Replit Auth routes FIRST (before proxy)
  await setupAuth(app);
  
  // IMPORTANT: Register API proxy AFTER auth routes
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

  // Exclude auth routes from proxy - they're handled by Express
  app.use("/api", (req, res, next) => {
    const authRoutes = ["/login", "/logout", "/callback", "/auth/user"];
    if (authRoutes.some(route => req.path === route || req.path.startsWith(route))) {
      return next("route");
    }
    return apiProxy(req, res, next);
  });

  // Body parsers AFTER proxy to avoid consuming the request body before proxying
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

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

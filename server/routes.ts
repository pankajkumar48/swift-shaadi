import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Proxy all /api requests to the Python FastAPI backend running on port 8000
  // In v3 of http-proxy-middleware, the path is stripped by default
  // Include /api in target to preserve the full path
  const apiProxy = createProxyMiddleware({
    target: "http://localhost:8000/api",  // Include /api in target to preserve prefix
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

  return httpServer;
}

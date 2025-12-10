import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Note: API proxy is registered in index.ts BEFORE body parsers
  // to ensure the raw body stream is preserved for proxying
  // No additional routes needed here
  return httpServer;
}

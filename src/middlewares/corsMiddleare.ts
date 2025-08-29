import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:5173", "https://payments-app-gray.vercel.app"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

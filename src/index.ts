import { Hono } from "hono";
import { cors } from "hono/cors";
import userRouter from "./routes/userRoutes";
import accountRouter from "./routes/accountRoutes";
import { Env, Variables } from "./types";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("*", cors());

app.all("/", (c) => {
  return c.json({
    message: "Payments Backend API - Cloudflare Workers",
    status: "healthy",
  });
});

const api = new Hono<{ Bindings: Env; Variables: Variables }>();

api.route("/user", userRouter);
api.route("/account", accountRouter);

app.route("/api/v1", api);

app.notFound((c) => {
  return c.json({ message: "Route not found" }, 404);
});

app.onError((err, c) => {
  console.error("Global error:", err);
  return c.json({ message: "Internal server error", error: err.message }, 500);
});

export default app;

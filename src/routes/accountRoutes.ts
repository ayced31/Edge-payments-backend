import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as accountController from "../controllers/accountController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { transferSchema } from "../validators/schemas";
import { Env, Variables } from "../types";
import { createPrismaClient } from "../services/prismaService";

const accountRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

accountRouter.get("/balance", authMiddleware, async (c) => {
  const prisma = createPrismaClient(c.env);
  return await accountController.getBalance(c, prisma);
});

accountRouter.post(
  "/transfer",
  authMiddleware,
  zValidator("json", transferSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Invalid transfer data" }, 400);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const prisma = createPrismaClient(c.env);
    return await accountController.transfer(c, input, prisma);
  }
);

export default accountRouter;

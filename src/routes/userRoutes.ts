import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as userController from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  signupSchema,
  signinSchema,
  updateUserSchema,
} from "../validators/schemas";
import { Env, Variables } from "../types";
import { createPrismaClient } from "../services/prismaService";

const userRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

userRouter.post(
  "/signup",
  zValidator("json", signupSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs / Email already taken" }, 411);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const prisma = createPrismaClient(c.env);
    return await userController.signup(c, input, prisma);
  }
);

userRouter.post(
  "/signin",
  zValidator("json", signinSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Incorrect inputs" }, 411);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const prisma = createPrismaClient(c.env);
    return await userController.signin(c, input, prisma);
  }
);

userRouter.put(
  "/update",
  authMiddleware,
  zValidator("json", updateUserSchema, (result, c) => {
    if (!result.success) {
      return c.json({ message: "Error while updating information" }, 411);
    }
  }),
  async (c) => {
    const input = c.req.valid("json");
    const prisma = createPrismaClient(c.env);
    return await userController.updateUser(c, input, prisma);
  }
);

userRouter.get("/search", authMiddleware, async (c) => {
  const prisma = createPrismaClient(c.env);
  return await userController.bulkSearch(c, prisma);
});

export default userRouter;

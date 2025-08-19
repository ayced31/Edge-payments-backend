import { Context } from "hono";
import {
  hashPassword,
  verifyPassword,
  generateToken,
} from "../services/authService";
import {
  Env,
  Variables,
  SignupResponse,
  SigninResponse,
  UserResponse,
  ResetPasswordInput,
} from "../types";
import { SignupInput, SigninInput } from "../validators/schemas";
import { PrismaClientType } from "../services/prismaService";

export async function signup(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: SignupInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return c.json({ message: "User already exists." }, 400);
    }

    const passwordHash = await hashPassword(input.password);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          passwordHash: passwordHash,
        },
      });

      const initialBalance = Number((1 + Math.random() * 10000).toFixed(2));

      await tx.account.create({
        data: {
          userId: newUser.id,
          balance: initialBalance,
        },
      });

      return newUser;
    });

    const token = await generateToken(result.id, c.env.JWT_SECRET);

    const response: SignupResponse = {
      message: "User created successfully.",
      token: token,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ message: "Error creating user." }, 500);
  }
}

export async function signin(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: SigninInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return c.json({ message: "User not found." }, 400);
    }

    const isValidPassword = await verifyPassword(
      input.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return c.json({ message: "Incorrect Password" }, 400);
    }

    const token = await generateToken(user.id, c.env.JWT_SECRET);

    const response: SigninResponse = {
      message: "User successfully logged in",
      name: user.firstName,
      token: token,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ message: "Error signing in." }, 500);
  }
}

export async function resetPassword(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: ResetPasswordInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      return c.json(
        {
          message: "If the email exists, password has been reset.",
          success: true,
        },
        200
      );
    }

    const passwordHash = await hashPassword(input.password);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return c.json(
      {
        message: "Password reset successfully",
        success: true,
      },
      200
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return c.json(
      {
        message: "Error resetting password.",
        success: false,
      },
      500
    );
  }
}

export async function bulkSearch(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");
    const filter = c.req.query("filter") || "";

    // Search users (excluding current user)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { firstName: { contains: filter, mode: "insensitive" } },
              { lastName: { contains: filter, mode: "insensitive" } },
            ],
          },
          { id: { not: userId } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    // Map to match original API response format
    const userResponse: UserResponse[] = users.map((user) => ({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    }));

    return c.json({ user: userResponse }, 200);
  } catch (error) {
    console.error("Bulk search error:", error);
    return c.json({ message: "Error searching users." }, 500);
  }
}

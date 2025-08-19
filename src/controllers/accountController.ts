import { Context } from "hono";
import { Env, Variables, BalanceResponse } from "../types";
import { TransferInput } from "../validators/schemas";
import { PrismaClientType } from "../services/prismaService";

export async function getBalance(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");

    const account = await prisma.account.findUnique({
      where: { userId: userId },
    });

    if (!account) {
      return c.json({ message: "Account not found." }, 404);
    }

    const response: BalanceResponse = {
      balance: account.balance,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error("Get balance error:", error);
    return c.json({ message: "Error fetching balance." }, 500);
  }
}

export async function transfer(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  input: TransferInput,
  prisma: PrismaClientType
): Promise<Response> {
  try {
    const userId = c.get("userId");
    const { amount, to } = input;

    const result = await prisma.$transaction(async (tx) => {
      const senderAccount = await tx.account.findUnique({
        where: { userId: userId },
      });

      if (!senderAccount || senderAccount.balance < amount) {
        throw new Error("Insufficient Balance.");
      }

      const receiverAccount = await tx.account.findUnique({
        where: { userId: to },
      });

      if (!receiverAccount) {
        throw new Error("Invalid account");
      }

      await tx.account.update({
        where: { userId: userId },
        data: { balance: { decrement: amount } },
      });

      await tx.account.update({
        where: { userId: to },
        data: { balance: { increment: amount } },
      });

      return { success: true };
    });

    return c.json({ message: "Transaction Successful." }, 200);
  } catch (error: any) {
    console.error("Transfer error:", error);

    if (
      error.message === "Insufficient Balance." ||
      error.message === "Invalid account"
    ) {
      return c.json({ message: error.message }, 400);
    }

    return c.json({ message: "Error processing transaction." }, 500);
  }
}

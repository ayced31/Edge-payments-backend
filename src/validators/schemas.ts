import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(4, "First name must be at least 4 characters"),
  lastName: z.string().min(4, "Last name must be at least 4 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(4).optional(),
  lastName: z.string().min(4).optional(),
  password: z.string().min(6).optional(),
});

export const transferSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  to: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type TransferInput = z.infer<typeof transferSchema>;

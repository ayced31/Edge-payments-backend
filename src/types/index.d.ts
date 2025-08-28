import type { PrismaClient } from "@prisma/client/edge";

export interface Env {
  DATABASE_URL: string;
  DIRECT_URL: string;
  JWT_SECRET: string;
}

export interface Variables {
  userId: string;
  prisma: PrismaClient;
}

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface UserResponse {
  firstName: string;
  lastName: string;
  _id: string;
}

export interface SignupResponse {
  message: string;
  token: string;
}

export interface SigninResponse {
  message: string;
  name: string;
  token: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface TransferRequest {
  amount: number;
  to: string;
}
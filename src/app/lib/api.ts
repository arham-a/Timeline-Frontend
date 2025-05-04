import { RegisterRequest, LoginRequest, ApiResponse } from "../types/auth";

const BASE_URL = "/api/auth";

export async function registerUser(payload: RegisterRequest): Promise<ApiResponse<{ userId: string }>> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendVerificationEmail(userId: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/send-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function loginUser(payload: LoginRequest): Promise<ApiResponse<{ accessToken: string }>> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return res.json();
}
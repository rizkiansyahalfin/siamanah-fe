import { api } from "@/lib/axios";
import type { LoginInput, RegisterInput } from "./auth.schema";

export const loginUser = async (data: LoginInput) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (data: RegisterInput) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

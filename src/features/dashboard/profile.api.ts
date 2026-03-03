import { api } from "@/lib/axios";
import type { User } from "../auth/api";

type ApiWrapper<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UpdateProfileRequest = {
  fullName?: string;
  phone?: string;
  avatar?: File;
};

export type ChangePasswordRequest = {
  oldPassword?: string;
  newPassword?: string;
};

export async function getProfile(): Promise<User> {
  const { data: res } = await api.get<ApiWrapper<User>>("/api/v1/profile");
  return res.data;
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<User> {
  const formData = new FormData();
  if (payload.fullName) formData.append("fullName", payload.fullName);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.avatar) formData.append("avatar", payload.avatar);

  const { data: res } = await api.put<ApiWrapper<User>>("/api/v1/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await api.post("/api/v1/profile/change-password", payload);
}

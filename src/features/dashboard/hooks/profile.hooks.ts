import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, changePassword, type UpdateProfileRequest, type ChangePasswordRequest } from "../profile.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      toast.success("Profil berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
    onSuccess: () => {
      toast.success("Password berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui password");
    },
  });
}

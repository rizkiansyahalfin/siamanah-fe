import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, loginUser, logoutUser } from "./auth.api";
import { useNavigate } from "react-router-dom";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      queryClient.clear();
      navigate("/login");
    },
  });
};

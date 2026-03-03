import { useMutation } from "@tanstack/react-query";
import {
  verifyOtp,
  type VerifyOtpRequest,
  type VerifyOtpResponse,
} from "../api";

export function useVerifyOtp() {

  return useMutation<
    VerifyOtpResponse,
    Error,
    VerifyOtpRequest
  >({

    mutationFn: verifyOtp,

  });

}

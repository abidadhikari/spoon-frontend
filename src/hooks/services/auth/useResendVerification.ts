"use client";
import {
  resendVerificationApiV1AuthResendVerificationPost,
  ResendVerificationApiV1AuthResendVerificationPostData,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<ResendVerificationApiV1AuthResendVerificationPostData>;

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } =
        await resendVerificationApiV1AuthResendVerificationPost({ body });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Verification email sent. Please check your inbox.");
    },
    onError: () => {
      toast.error("Failed to resend verification email. Please try again.");
    },
  });
};


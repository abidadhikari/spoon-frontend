"use client";
import {
  forgotPasswordApiV1AuthForgotPasswordPost,
  ForgotPasswordApiV1AuthForgotPasswordPostData,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation } from "@tanstack/react-query";

type BodyType = BodyOf<ForgotPasswordApiV1AuthForgotPasswordPostData>;

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } =
        await forgotPasswordApiV1AuthForgotPasswordPost({ body });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    // No toast here — the form shows an inline success state
  });
};


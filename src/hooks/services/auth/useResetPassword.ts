"use client";
import {
  resetPasswordApiV1AuthResetPasswordPost,
  ResetPasswordApiV1AuthResetPasswordPostData,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation } from "@tanstack/react-query";

type BodyType = BodyOf<ResetPasswordApiV1AuthResetPasswordPostData>;

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } =
        await resetPasswordApiV1AuthResetPasswordPost({ body });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    // No toast — the form shows an inline success state
  });
};


"use client";
import {
  verifyUserApiV1AuthVerifyPost,
  VerifyUserApiV1AuthVerifyPostData,
  UserResponse,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<VerifyUserApiV1AuthVerifyPostData>;

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } = await verifyUserApiV1AuthVerifyPost({
        body,
      });
      if (error || !data) {
        throw error;
      }
      return data as UserResponse;
    },
    onSuccess: () => {
      toast.success("Email verified successfully.");
    },
    onError: () => {
      toast.error("Invalid verification code. Please try again.");
    },
  });
};

"use client";
import {
  registerApiV1AuthRegisterPost,
  RegisterApiV1AuthRegisterPostData,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<RegisterApiV1AuthRegisterPostData>;

export const useRegister = () => {
  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } = await registerApiV1AuthRegisterPost({
        body,
      });
      if (error || !data) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Account created. Please verify your email.");
    },
    onError: () => {
      toast.error("Failed to create account. Please try again.");
    },
  });
};

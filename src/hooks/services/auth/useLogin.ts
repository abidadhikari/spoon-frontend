"use client";
import {
  loginApiV1AuthLoginPost,
  LoginApiV1AuthLoginPostData,
} from "@/client-services";
import { BodyOf } from "@/types/query.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type BodyType = BodyOf<LoginApiV1AuthLoginPostData>;

interface LoginResponse {
  access_token: string;
  token_type?: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (body: BodyType) => {
      const { data, error } = await loginApiV1AuthLoginPost({
        body,
      });
      if (error || !data) {
        throw error;
      }
      return data as LoginResponse;
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      toast.success("Logged in successfully.");
    },
    onError: () => {
      toast.error("Invalid credentials. Please try again.");
    },
  });
};

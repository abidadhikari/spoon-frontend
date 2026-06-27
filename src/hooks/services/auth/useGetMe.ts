import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  username: string;
  email: string;
  // add other fields from your API response
}

const getMe = async (): Promise<User> => {
  console.log("Fetching user data...");
  console.log(localStorage.getItem("access_token"));
  const response = await fetch("http://localhost:8000/api/v1/auth/get-me", {
    method: "GET",
    // credentials: "include", // if using cookies
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

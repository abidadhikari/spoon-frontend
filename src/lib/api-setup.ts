import { client } from "@/client-services/client.gen";

export const initApiClient = () => {
  client.setConfig({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    throwOnError: true,
  });

  if (typeof window !== "undefined") {
    // Request Interceptor
    client.instance.interceptors.request.use(async (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response Interceptor (Refresh Logic)
    client.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // If 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            // const newToken = await tokenManager.refreshAccessToken();
            // if (newToken) {
            //   // Retry the original request with new token
            //   originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //   return client.instance(originalRequest);
            // }
          } catch (refreshError) {
            // Refresh failed, user will be redirected to login
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }
};

initApiClient();

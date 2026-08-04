export const useLogout = () => {
  return () => {
    localStorage.removeItem("access_token");
  };
};

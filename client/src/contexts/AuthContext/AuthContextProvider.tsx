import { useCallback, useMemo } from "react";
import { AuthContext, type User, type AuthContextType } from "./AuthContext";
import type { ReactNode } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthProviderProps {
  children: ReactNode;
}

const fecthMe = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get("/auth/me");
    console.log("/me response", response.data);
    if (response.status === 200) {
      const { username, email, role } = response.data.data.user;
      return { username, email, role };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch /me:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: fecthMe,
    staleTime: 1000 * 60 * 5, // cache valid for 5 min
    retry: false,
  });

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
      queryClient.removeQueries({ queryKey: ["me"] }); // clear cached user
      toast.success('Logout Successful!');
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, [queryClient]);

  const value = useMemo<AuthContextType>(
    () => ({
      user: user ?? null,
      logout,
      refetchMe: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
      isLoading,
    }),
    [user, logout, queryClient, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

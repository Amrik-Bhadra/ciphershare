import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, type User, type AuthContextType } from "./AuthContext";
import type { ReactNode } from "react";
import axiosInstance, { setAccessToken } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

interface AuthProviderProps {
  children: ReactNode;
}

const fetchMe = async (): Promise<User | null> => {
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);

        const me = await axiosInstance.get("/auth/me");
        setUser(me.data.user);
      } catch {
        setUser(null);
        setAccessToken("");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setAccessToken("");
      toast.success('Logout successful!');
    } catch (error) {
      console.log(error);
      toast.error('Logout Failed!');
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: user ?? null,
      login,
      logout,
      fetchMe,
      isLoading,
    }),
    [user, login, logout, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

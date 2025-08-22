import { createContext } from "react";

export interface User{
    username: string;
    email: string;
    role: string;
}

export interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  refetchMe: () => Promise<void>;
  isLoading: boolean;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);
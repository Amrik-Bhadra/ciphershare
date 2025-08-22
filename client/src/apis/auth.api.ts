import type { ILoginUser, IRegisterUser } from "../interfaces/user.interface";
import axiosInstance from "../utils/axiosInstance"

export const registerUser = async (userData: IRegisterUser) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response;
}

export const loginUser = async (userData: ILoginUser) => {
    const response = await axiosInstance.post('/auth/login', userData);
    return response;
}

export const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response;
}

export const resetPassword = async ({ token, password }: { token: string, password: string }) => {
    const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
    return response;
}


import { z } from "zod";

export const registerUserSchema = z.object({
    username: z.string().min(2, "Username should have atleast 2 characters"),
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(8, 'Password should be at least 8 characters'),
    role: z.enum(["user", "admin"]),
});

export const loginUserSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(8, 'Password should be at least 8 characters')
});

export type RegisterDTO = z.infer<typeof registerUserSchema>;
export type LoginDTO = z.infer<typeof loginUserSchema>;
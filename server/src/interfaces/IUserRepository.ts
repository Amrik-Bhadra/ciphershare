import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
    create(userData: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
}
import { Prisma, User } from "@prisma/client";
import prisma from "../utils/prisma";
import { IUserRepository } from "../interfaces/IUserRepository";

class UserRepository implements IUserRepository {
    async create(userData: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data: userData,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email,
            }
        })
    }

    async findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id
            }
        })
    }
}

export default new UserRepository();
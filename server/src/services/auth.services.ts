import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces/IUserRepository";
import userRepository from "../repositories/user.repository";
import refreshTokenRepository from "../repositories/refreshToken.repository";
import { IRefreshTokenRepository } from "../interfaces/IRefreshTokenRepository";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";

const generateTokens = (user: User) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

class AuthService {
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository) { }

    async register(userData: RegisterDTO): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const userToCreate = {
            ...userData,
            password: hashedPassword
        }

        const newUser = userRepository.create(userToCreate);
        return newUser;
    }

    async login(loginData: LoginDTO): Promise<{ accessToken: string; refreshToken: string, user: User } | null> {
        const user = await userRepository.findByEmail(loginData.email);

        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        const { accessToken, refreshToken } = generateTokens(user);
        const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

        await refreshTokenRepository.create({
            hashedToken: hashedRefreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        return { accessToken, refreshToken, user };
    }

    async logout(refreshToken: string): Promise<void> {
        console.log('token:', refreshToken);
        const tokenInDb = await refreshTokenRepository.findByToken(refreshToken);
        console.log('token in db: ', tokenInDb);

        if (tokenInDb) {
            await refreshTokenRepository.delete(tokenInDb.id);
        }
    }

    async refreshToken(token: string): Promise<string | null> {
        console.log('inside refreshToken service');
        const tokenInDb = await refreshTokenRepository.findByToken(token);
        if (!tokenInDb) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { id: string };
        const user = await userRepository.findUserById(decoded.id);
        if (!user) {
            return null;
        }

        const { accessToken } = generateTokens(user);
        return accessToken;
    }
}

export default new AuthService(userRepository, refreshTokenRepository);
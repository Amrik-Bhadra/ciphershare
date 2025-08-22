import { Prisma, RefreshToken } from "@prisma/client";

export interface IRefreshTokenRepository {
    create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    delete(id: string): Promise<RefreshToken>
}
import { Prisma, RefreshToken } from '@prisma/client';
import prisma from '../utils/prisma';
import crypto from 'crypto';

class RefreshTokenRepository {

  async create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return prisma.refreshToken.findUnique({
      where: {
        hashedToken,
      },
    });
  }

  async delete(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }
}

export default new RefreshTokenRepository();
import { Prisma, RefreshToken } from '@prisma/client';
import prisma from '../utils/prisma';
import crypto from 'crypto';

class RefreshTokenRepository {
  async create(data: Prisma.RefreshTokenUncheckedCreateInput): Promise<RefreshToken> {
    // return prisma.refreshToken.create({
    //   data,
    // });
    try {
      return await prisma.refreshToken.create({
        data,
      });
    } catch (err: any) {
      if (err.code === "P2002" && err.meta?.target?.includes("hashedToken")) {
        // 🔁 regenerate a new hashedToken if collision occurs
        const newHashedToken = crypto.randomBytes(64).toString("hex");
        return await prisma.refreshToken.create({
          data: {
            ...data,
            hashedToken: newHashedToken,
          },
        });
      }
      throw err;
    }
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('hashedtokn:', hashedToken);
    return prisma.refreshToken.findUnique({
      where: {
        hashedToken,
      },
    });
  }

  async delete(id: string): Promise<RefreshToken> {
    return prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async update(id: string, data: { hashedToken: string; expiresAt: Date }) {
    return prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  async markAsRotated(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: { rotated: true }
    })
  }
}

export default new RefreshTokenRepository();
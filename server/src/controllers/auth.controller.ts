import { Request, Response } from "express";
import authServices from "../services/auth.services";
import { IRequestWithUser } from "../middlewares/auth.middleware";
import crypto from "crypto";
import refreshTokenRepository from "../repositories/refreshToken.repository";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.ENVIRONMENT === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
    async register(req: Request, res: Response) {
        try {
            const newUser = await authServices.register(req.body);
            (newUser as any).password = undefined;
            res.status(201).json({ message: 'User Created!', data: { user: newUser } })
        } catch (error: any) {
            if (error.code === 'P2002') {
                return res.status(409).json({ message: 'An account with this email already exists.' });
            }
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await authServices.login(req.body);
            if (!result) {
                return res.status(401).json({ message: 'Invalid Credentials' });
            }

            const { accessToken, refreshToken, user } = result;

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.ENVIRONMENT === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json({
                accessToken,
                user
            });
        } catch (error) {
            console.log('Login Controller error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { refreshToken } = req.cookies;

            if (refreshToken) {
                await authServices.logout(refreshToken);
            }

            res.clearCookie('refreshToken');
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: 'An unexpected error occurred during logout' });
        }
    }

    // async refreshToken(req: Request, res: Response) {
    //     try {
    //         // get refreshToken from cookie
    //         const { refreshToken } = req.cookies;

    //         // check if refreshToken present in cookie
    //         if (!refreshToken) {
    //             return res.status(401).json({ message: 'Refresh token not available' });
    //         }

    //         // validate the refreshToken with token stored in db
    //         const tokenInDb = await refreshTokenRepository.findByToken(refreshToken);

    //         // if not then clear the cookie
    //         if (!tokenInDb) {
    //             console.log('clearing httpOnly cookie');
    //             res.clearCookie('refreshToken', {
    //                 httpOnly: true,
    //                 secure: process.env.ENVIRONMENT === 'production',
    //                 sameSite: 'strict'
    //             });
    //             return res.status(403).json({ message: "Invalid refresh token. Session revoked." });
    //         }

    //         // check if the token has expired or not
    //         if (tokenInDb.expiresAt.getTime() < Date.now()) {
    //             await refreshTokenRepository.delete(tokenInDb.id);
    //             res.clearCookie('refreshToken', {
    //                 httpOnly: true,
    //                 secure: process.env.ENVIRONMENT === 'production',
    //                 sameSite: 'strict'
    //             });
    //             return res.status(403).json({ message: "Refresh token expired" });
    //         }

    //         // detect reuse (rotate token resue attack)
    //         if (tokenInDb.rotated) {
    //             await refreshTokenRepository.deleteAllForUser(tokenInDb.userId);
    //             return res.status(403).json({ message: "Token reuse detected, logged out everywhere" });
    //         }

    //         // Rotate token: mark old one as used
    //         await refreshTokenRepository.markAsRotated(tokenInDb.id);

    //         const user = await userRepository.findUserById(tokenInDb.userId);
    //         if (!user) {
    //             return res.status(401).json({ message: 'User not found!' });
    //         }

    //         // 7. Generate new tokens
    //         const accessToken = jwt.sign(
    //             { id: user?.id, role: user?.role },
    //             process.env.JWT_SECRET!,
    //             { expiresIn: "15m" }
    //         );

    //         const newRefreshToken = jwt.sign(
    //             { id: user?.id, role: user?.role },
    //             process.env.REFRESH_SECRET!,
    //             { expiresIn: "7d" }
    //         );

    //         // hash the refresh token
    //         const hashedToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    //         // create new refresh token record in database
    //         await refreshTokenRepository.create({
    //             hashedToken,
    //             userId: user.id,
    //             expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //         });

    //         // set new refresh token
    //         res.cookie("refreshToken", newRefreshToken, {
    //             httpOnly: true,
    //             secure: true,
    //             sameSite: "strict",
    //             path: "/",
    //             maxAge: 7 * 24 * 60 * 60 * 1000, 
    //         });

    //         // Send access token in response body
    //         return res.json({ accessToken });

    //     } catch (error) {
    //         console.error("Refresh token error:", error);
    //         return res.status(403).json({ message: "Invalid or expired refresh token." });
    //     }
    // }

    async refreshToken(req: Request, res: Response) {
        try {
            // 1) Read cookie
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token not available" });
            }

            // 2) Find token record (repo hashes internally)
            const tokenInDb = await refreshTokenRepository.findByToken(refreshToken);
            if (!tokenInDb) {
                // No matching token → session revoked
                res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTS);
                return res.status(403).json({ message: "Invalid refresh token. Session revoked." });
            }

            // 3) Check expiration
            if (tokenInDb.expiresAt.getTime() < Date.now()) {
                await refreshTokenRepository.delete(tokenInDb.id);
                res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTS);
                return res.status(403).json({ message: "Refresh token expired" });
            }

            // (Optional) If your model has `rotated` and you set it elsewhere, enforce reuse rule:
            if ((tokenInDb as any).rotated) {
                await refreshTokenRepository.deleteAllForUser(tokenInDb.userId);
                res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTS);
                return res.status(403).json({ message: "Token reuse detected, logged out everywhere" });
            }

            // 4) Load user
            const user = await userRepository.findUserById(tokenInDb.userId);
            if (!user) {
                res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTS);
                return res.status(401).json({ message: "User not found!" });
            }

            // 5) Generate new tokens
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: "15m" }
            );

            const newRefreshToken = jwt.sign(
                { id: user.id },
                process.env.REFRESH_SECRET!,
                { expiresIn: "7d" }
            );
            const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

            // 6) Rotate atomically (delete old specific record + insert new one)
            try {
                await authServices.rotateRefreshToken(user.id, tokenInDb.hashedToken, newHashedToken);
            } catch (err: any) {
                // If another concurrent refresh did it first → treat as reuse/double-refresh
                if (err?.code === "TOKEN_REUSE_OR_RACE" || err?.message === "TOKEN_ALREADY_ROTATED_OR_REUSED") {
                    // Strong response: wipe all sessions to be safe
                    await refreshTokenRepository.deleteAllForUser(user.id);
                    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTS);
                    return res.status(403).json({ message: "Token reuse detected. Logged out everywhere." });
                }
                throw err; // unknown error → bubble up
            }

            // 7) Set new cookie and return new access token
            res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, REFRESH_COOKIE_OPTS);
            return res.json({ accessToken });
        } catch (error) {
            console.error("Refresh token error:", error);
            res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTS);
            return res.status(403).json({ message: "Invalid or expired refresh token." });
        }
    }

    async getMe(req: IRequestWithUser, res: Response) {
        try {
            const user = req.user;
            (user as any).password = undefined;

            res.status(200).json({ message: 'User data found', user });
        } catch (error) {
            console.log('GetMe Controller error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}

export default new AuthController();
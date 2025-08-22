import { Request, Response } from "express";
import authServices from "../services/auth.services";

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

    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({ message: 'No refresh token provided' });
            }

            const newAccessToken = await authServices.refreshToken(refreshToken);
            if (!newAccessToken) {
                return res.status(403).json({ message: 'Invalid or expired refresh token.' });
            }
            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired refresh token.' });
        }
    }
}

export default new AuthController();
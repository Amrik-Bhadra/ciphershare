import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import userRepository from "../repositories/user.repository";

export interface IRequestWithUser extends Request {
    user?: User;
}

export const protect = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const currentUser = await userRepository.findUserById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
        }
        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
}
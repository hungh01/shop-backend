import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload {
    userId: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: TokenPayload;
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.Authentication;
    console.log('Token:', token);

    if (!token) {
        res.status(401).json({ message: 'Vui lòng đăng nhập!' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        req.user = decoded; // Gắn payload vào request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Tài khoản đã hết thời gian đăng nhập, vui lòng đăng nhập lại.' });
        return;
    }
};

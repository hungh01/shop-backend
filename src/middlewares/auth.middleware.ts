// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

interface TokenPayload {
    userId: string;
    // Bạn có thể thêm các thuộc tính khác nếu cần, ví dụ userRole, isUser,...
}
declare module 'express-serve-static-core' {
    interface Request {
        user?: TokenPayload;
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies?.Authentication;
    if (!token) {
        res.status(401).json({ message: 'Vui lòng đăng nhập!' });
        return;
    }

    try {
        // Thử xác thực access token
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        req.user = decoded;
        next();
    } catch (error: any) {
        // Nếu lỗi do access token hết hạn
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'Hết phiên, vui lòng đăng nhập lại!' });
                return;
            }

            try {
                // Xác thực refresh token
                const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string, isUser: string };
                // Tạo access token mới
                const newAccessToken = jwt.sign({ userId: payload.userId, userRole: payload.isUser }, JWT_SECRET, { expiresIn: '1h' });
                // Set cookie mới cho access token
                res.cookie('Authentication', newAccessToken, {
                    httpOnly: true,
                    secure: false,          // Đặt true khi dùng HTTPS
                    sameSite: 'lax',        // Nếu dùng HTTPS cross-origin, cần "none" và secure:true
                    path: '/',
                });
                // Gán payload mới vào req.user
                req.user = { userId: payload.userId };
                return next();
            } catch (refreshError) {
                res.status(401).json({ message: 'Phiên làm việc hết hạn, vui lòng đăng nhập lại!' });
                return;
            }
        } else {
            res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' });
            return;
        }
    }
};

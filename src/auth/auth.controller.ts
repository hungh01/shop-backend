import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from './auth.service';
import { SignUpRequest } from './dto/signup.request';
import { LoginRequest } from './dto/login.request';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';


export const getUsers = async (req: Request, res: Response): Promise<void> => {
    console.log(req.user);
    const users = await authService.getAllUsers();
    res.json(users);
};

export const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await authService.createUser(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};


export const logOut = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('Authentication');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: ['Logged out successfully'] });
};

export const logIn = async (req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await authService.logIn(req.body);

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }

        let isUser = 'true';
        if (result.user) {
            isUser = result.user.isUser === true ? 'true' : 'false';
        }

        if (!result.user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign({ userId: result.user.id, isUser: result.user.isUser }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: result.user.id, isUser: result.user.isUser }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });
        res.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken,
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'No token' });
        return;
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string, isUser: string };
        const newAccessToken = jwt.sign(
            { userId: payload.userId, userRole: payload.isUser },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ accessToken: newAccessToken, isUser: payload.isUser });
        return;
    } catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
    }
};

import { PrismaClient } from '@prisma/client';

import { SignUpRequest } from './dto/signup.request';
import * as bcryptjs from 'bcryptjs';
import createHttpError from 'http-errors';
import { LoginRequest } from './dto/login.request';
import { signJwt } from '../utils/jwt';
import { stat } from 'fs';


const prisma = new PrismaClient();


export const getUser = async (userId: string | undefined) => {
    if (!userId) {
        return
    }
    return prisma.user.findUnique(
        {
            where: { id: parseInt(userId) },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                city: true,
                district: true,
                ward: true,
                address: true,
                createdAt: true,
                updatedAt: true
            }
        }
    );
};


export const createUser = async (userData: SignUpRequest) => {
    console.log(userData);
    if (userData.password !== userData.confirmPassword) {
        return {
            success: false,
            status: 400,
            message: 'Mật khẩu và xác nhận mật khẩu không khớp'
        }
    }
    if (!userData.name || !userData.email || !userData.password) {
        return {
            success: false,
            status: 400,
            message: 'Tên, email và mật khẩu là bắt buộc'
        }

    }
    const { confirmPassword, ...data } = userData;
    if (await getUserByEmail(data.email)) {
        return {
            success: false,
            status: 409,
            message: 'Email này đã được sử dụng'
        }
    }

    const createdUser = await prisma.user.create({
        data: {
            ...data,
            password: await bcryptjs.hash(data.password, 12)
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return {
        success: true,
        message: 'Tài khoản đã được tạo thành công!',
        data: createdUser,
    };
};


export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email }
    });
};

export const logIn = async (info: LoginRequest) => {
    const user = await prisma.user.findUnique({ where: { email: info.email } });

    if (!user) return {
        success: false,
        status: 401,
        message: 'Tài khoản hoặc mật khẩu không đúng'
    }

    const match = await bcryptjs.compare(info.password, user.password);

    if (!match) return {
        success: false,
        status: 401,
        message: 'Tài khoản hoặc mật khẩu không đúng'
    }

    const token = signJwt({ userId: user.id });

    return {
        success: true,
        message: 'Đăng nhập thành công',
        token: token,
        user: user
    };
};


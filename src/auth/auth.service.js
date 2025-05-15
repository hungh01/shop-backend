"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.getUserByEmail = exports.createUser = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs = __importStar(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        return;
    }
    return prisma.user.findUnique({
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
    });
});
exports.getUser = getUser;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userData);
    if (userData.password !== userData.confirmPassword) {
        return {
            success: false,
            status: 400,
            message: 'Mật khẩu và xác nhận mật khẩu không khớp'
        };
    }
    if (!userData.name || !userData.email || !userData.password) {
        return {
            success: false,
            status: 400,
            message: 'Tên, email và mật khẩu là bắt buộc'
        };
    }
    const { confirmPassword } = userData, data = __rest(userData, ["confirmPassword"]);
    if (yield (0, exports.getUserByEmail)(data.email)) {
        return {
            success: false,
            status: 409,
            message: 'Email này đã được sử dụng'
        };
    }
    const createdUser = yield prisma.user.create({
        data: Object.assign(Object.assign({}, data), { password: yield bcryptjs.hash(data.password, 12) }),
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
});
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.findUnique({
        where: { email }
    });
});
exports.getUserByEmail = getUserByEmail;
const logIn = (info) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({ where: { email: info.email } });
    if (!user)
        return {
            success: false,
            status: 401,
            message: 'Tài khoản hoặc mật khẩu không đúng'
        };
    const match = yield bcryptjs.compare(info.password, user.password);
    if (!match)
        return {
            success: false,
            status: 401,
            message: 'Tài khoản hoặc mật khẩu không đúng'
        };
    const token = (0, jwt_1.signJwt)({ userId: user.id });
    return {
        success: true,
        message: 'Đăng nhập thành công',
        token: token,
        user: user
    };
});
exports.logIn = logIn;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logIn = exports.logOut = exports.signUp = exports.getUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService = __importStar(require("./auth.service"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const users = yield authService.getUser((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    res.json(users);
});
exports.getUser = getUser;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authService.createUser(req.body);
        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('Authentication');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: ['Logged out successfully'] });
});
exports.logOut = logOut;
const logIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield authService.logIn(req.body);
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
        const accessToken = jsonwebtoken_1.default.sign({ userId: result.user.id, isUser: result.user.isUser }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: result.user.id, isUser: result.user.isUser }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        next(error);
    }
});
exports.logIn = logIn;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'No token' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: payload.userId, userRole: payload.isUser }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ accessToken: newAccessToken, isUser: payload.isUser });
        return;
    }
    catch (err) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
    }
});
exports.refreshToken = refreshToken;

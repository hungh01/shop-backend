"use strict";
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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.Authentication;
    if (!token) {
        res.status(401).json({ message: 'Vui lòng đăng nhập!' });
        return;
    }
    try {
        // Thử xác thực access token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        // Nếu lỗi do access token hết hạn
        if (error.name === 'TokenExpiredError') {
            const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: 'Hết phiên, vui lòng đăng nhập lại!' });
                return;
            }
            try {
                // Xác thực refresh token
                const payload = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
                // Tạo access token mới
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: payload.userId, userRole: payload.isUser }, JWT_SECRET, { expiresIn: '1h' });
                // Set cookie mới cho access token
                res.cookie('Authentication', newAccessToken, {
                    httpOnly: true,
                    secure: false, // Đặt true khi dùng HTTPS
                    sameSite: 'lax', // Nếu dùng HTTPS cross-origin, cần "none" và secure:true
                    path: '/',
                });
                // Gán payload mới vào req.user
                req.user = { userId: payload.userId };
                return next();
            }
            catch (refreshError) {
                res.status(401).json({ message: 'Phiên làm việc hết hạn, vui lòng đăng nhập lại!' });
                return;
            }
        }
        else {
            res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' });
            return;
        }
    }
});
exports.authMiddleware = authMiddleware;

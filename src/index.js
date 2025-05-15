"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const products_route_1 = __importDefault(require("./products/products.route"));
const categories_route_1 = __importDefault(require("./categories/categories.route"));
const orders_route_1 = __importDefault(require("./order/orders.route"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
// Create a pino logger instance
const logger = (0, pino_1.default)();
app.use((0, pino_http_1.default)({ level: 'info' }));
app.use((0, cors_1.default)({
    origin: process.env.UI_URL, // Cho phép nguồn này
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Cho phép các phương thức
    allowedHeaders: ['Content-Type'], // Cho phép header Content-Type
    credentials: true,
}));
// Middleware để phân tích body của request
app.use(express_1.default.json()); // Dùng express.json() để phân tích JSON body
app.use(body_parser_1.default.urlencoded({ extended: true })); // Nếu cần hỗ trợ form data
// Middleware để log body của request
app.use((req, res, next) => {
    // Log body của request
    logger.info({ body: req.body }, 'Request body logged');
    next();
});
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            const dir = path_1.default.join(__dirname, '../uploads/ckeditor');
            fs_1.default.mkdirSync(dir, { recursive: true }); // Đảm bảo thư mục tồn tại
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
    }),
});
app.post('/image-description', upload.single('upload'), (req, res) => {
    console.log("req.file");
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const fileUrl = `${process.env.API_URL}/uploads/ckeditor/${file.filename}`;
    res.status(200).json({ url: fileUrl });
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', auth_route_1.default);
app.use('/products', products_route_1.default);
app.use('/categories', categories_route_1.default);
app.use('/order', orders_route_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

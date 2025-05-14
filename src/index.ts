import express from 'express';
import authRoutes from './auth/auth.route';
import productRoutes from './products/products.route';
import categoriesRoutes from './categories/categories.route';
import orderRoutes from './order/orders.route';

import { Request, Response, NextFunction } from 'express';

import 'dotenv/config';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import pinoHttp from 'pino-http';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';

import fs from 'fs';


const app = express();

// Create a pino logger instance
const logger = pino();
app.use(pinoHttp({ level: 'info' }));

app.use(cors({
    origin: process.env.UI_URL,  // Cho phép nguồn này
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Cho phép các phương thức
    allowedHeaders: ['Content-Type'],  // Cho phép header Content-Type
    credentials: true,
}));

// Middleware để phân tích body của request
app.use(express.json()); // Dùng express.json() để phân tích JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Nếu cần hỗ trợ form data

// Middleware để log body của request
app.use((req: Request, res: Response, next: NextFunction) => {
    // Log body của request
    logger.info({ body: req.body }, 'Request body logged');
    next();
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.join(__dirname, '../uploads/ckeditor');
            fs.mkdirSync(dir, { recursive: true }); // Đảm bảo thư mục tồn tại
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
    }),
});

app.post('/image-description', upload.single('upload'), (req, res): void => {
    console.log("req.file");
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const fileUrl = `${process.env.API_URL}/uploads/ckeditor/${file.filename}`;
    res.status(200).json({ url: fileUrl });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoriesRoutes);
app.use('/order', orderRoutes);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

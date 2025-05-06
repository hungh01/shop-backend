import express from 'express';
import authRoutes from './auth/auth.route';
import productRoutes from './products/products.route';
import categoriesRoutes from './categories/categories.route';

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
    methods: ['GET', 'POST', 'OPTIONS'],  // Cho phép các phương thức
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




app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoriesRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

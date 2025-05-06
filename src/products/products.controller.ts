import { NextFunction, Request, Response } from "express";

import * as productService from "./products.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateProductRequest } from "./dto/create-product.request";


export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await productService.getProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
};


export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(CreateProductRequest, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
        res.status(400).json({ message: 'Invalid input', errors });
        return;
    }

    if (!req.file) {
        res.status(400).json({ message: 'Image file is required' });
        return;
    }
    console.log('File:', req.file);
    console.log('Body:', req.body);


    try {
        const product = await productService.createProduct(req.body, req.file.filename);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = req.params.id;
        const updatedProduct = await productService.updateProduct(productId, req.body, req.file?.filename || 'undefined');
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
};
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productService.deleteProduct(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}



export const getProductsByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const name = req.query.name as string;
        const products = await productService.getProductsByName(name);
        res.json(products);
    } catch (error) {
        next(error);
    }
};


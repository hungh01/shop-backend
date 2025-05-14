
import { NextFunction, Request, Response } from 'express';
import * as categoriesService from './categories.service';

export const addProductCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedProduct = await categoriesService.addProductCategory(req.body);
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
}

export const getProductCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await categoriesService.getProductCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
}

export const getCategoriesById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categoryId = req.params.categoryId;
        const page = req.query.page ? +req.query.page : 1;
        const limitPage = req.query.limitPage ? +req.query.limitPage : 8;
        const categories = await categoriesService.getCategoriesById(+categoryId, page, limitPage);
        if (!categories) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(categories);
    } catch (error) {
        next(error);
    }
}
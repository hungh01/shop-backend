
import { CreateProductCategoryRequest } from "./dto/create-product-category.request";

import prisma from '../prisma/client';



export const addProductCategory = async (data: CreateProductCategoryRequest) => {
    return await prisma.productCategory.create({
        data: {
            ...data
        }
    });
}

export const getProductCategories = async () => {
    return await prisma.productCategory.findMany({
        include: {
            products: true
        }
    });
}

export const getCategoriesById = async (categoryId: number, page: number, limitPage: number) => {
    const category = await prisma.productCategory.findFirst({
        where: { id: categoryId },
        include: {
            products: true
        }
    });
    const products = category?.products;
    const startIndex = (page - 1) * limitPage;
    const endIndex = startIndex + limitPage;
    const paginatedProducts = products?.slice(startIndex, endIndex);
    return {
        page,
        pageLimit: limitPage,
        totalPages: Math.ceil((products?.length || 0) / limitPage),
        totalProducts: products?.length || 0,
        paginatedProducts
    };
}
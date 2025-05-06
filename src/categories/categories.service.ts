import { PrismaClient } from "@prisma/client";
import { CreateProductCategoryRequest } from "./dto/create-product-category.request";

const prisma = new PrismaClient();


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

export const getCategoriesById = async (categoryId: string) => {
    return await prisma.productCategory.findUnique({
        where: { id: Number(categoryId) }
    });
}
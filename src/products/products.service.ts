import { PrismaClient } from "@prisma/client";
import { ProductsResponse } from "./dto/products.respone";
import { CreateProductRequest } from "./dto/create-product.request";
import { CreateProductCategoryRequest } from "../categories/dto/create-product-category.request";



const prisma = new PrismaClient();

export const getProducts = async () => {
    return await prisma.product.findMany();

}
export const getProductById = async (id: string) => {
    return await prisma.product.findUnique({
        where: { id: Number(id) }
    });
}

export const createProduct = async (productData: CreateProductRequest, filename: string) => {

    return await prisma.product.create({
        data: {
            ...productData,
            stock: parseInt(productData.stock),
            price: parseFloat(productData.price),
            categoryId: parseInt(productData.categoryId),
            image: `/uploads/${filename}`
        }
    });
}

export const updateProduct = async (id: string, productData: CreateProductRequest, filename: string) => {
    return await prisma.product.update({
        where: { id: Number(id) },
        data: {
            ...productData,
            stock: parseInt(productData.stock),
            price: parseFloat(productData.price),
            categoryId: parseInt(productData.categoryId),
            image: `/uploads/${filename}`
        }
    });
}

export const deleteProduct = async (id: string) => {
    return await prisma.product.delete({
        where: { id: Number(id) }
    });
}

export const getProductsByCategory = async (categoryId: string) => {
    return await prisma.product.findMany({
        where: { categoryId: Number(categoryId) }
    });
}
export const getProductsByName = async (name: string) => {
    return await prisma.product.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive'
            }
        }
    });
}


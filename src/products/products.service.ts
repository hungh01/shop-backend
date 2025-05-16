
import { CreateProductRequest } from "./dto/create-product.request";
import { UpdateProductRequest } from "./dto/update-product.request";



import prisma from '../prisma/client';


export const getProducts = async (productName: string, productCategoryName: string, stock: string) => {
    return await prisma.product.findMany({
        where: {
            name: {
                contains: productName,
                mode: 'insensitive'
            },
            category: {
                name: {
                    contains: productCategoryName,
                    mode: 'insensitive'
                }
            },
            stock: stock === '-1' ? undefined : parseInt(stock) // lấy đúng bằng stock
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

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

export const updateProduct = async (id: string, productData: UpdateProductRequest, filename: string) => {
    return await prisma.product.update({
        where: { id: Number(id) },
        data: {
            ...productData,
            stock: parseInt(productData.stock),
            price: parseFloat(productData.price),
            categoryId: parseInt(productData.categoryId),
            image: filename ? `/uploads/${filename}` : productData.image
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

export const getProductsByIds = async (ids: number[]) => {
    return await prisma.product.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
}

export const getProductDashboard = async () => {
    const products = await prisma.product.findMany({
        include: {
            category: true
        }
    });


    const totalStockCount = products.reduce((acc, product) => acc + (product.stock ?? 0), 0);
    const totalInventoryValue = products.reduce((acc, product) => acc + (product.price ?? 0) * (product.stock ?? 0), 0);
    return {
        totalStockCount,
        totalInventoryValue,
    };
};
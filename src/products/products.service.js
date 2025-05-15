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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductDashboard = exports.getProductsByIds = exports.getProductsByName = exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (productName, productCategoryName, stock) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findMany({
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
});
exports.getProducts = getProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findUnique({
        where: { id: Number(id) }
    });
});
exports.getProductById = getProductById;
const createProduct = (productData, filename) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.create({
        data: Object.assign(Object.assign({}, productData), { stock: parseInt(productData.stock), price: parseFloat(productData.price), categoryId: parseInt(productData.categoryId), image: `/uploads/${filename}` })
    });
});
exports.createProduct = createProduct;
const updateProduct = (id, productData, filename) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.update({
        where: { id: Number(id) },
        data: Object.assign(Object.assign({}, productData), { stock: parseInt(productData.stock), price: parseFloat(productData.price), categoryId: parseInt(productData.categoryId), image: filename ? `/uploads/${filename}` : productData.image })
    });
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.delete({
        where: { id: Number(id) }
    });
});
exports.deleteProduct = deleteProduct;
const getProductsByCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findMany({
        where: { categoryId: Number(categoryId) }
    });
});
exports.getProductsByCategory = getProductsByCategory;
const getProductsByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive'
            }
        }
    });
});
exports.getProductsByName = getProductsByName;
const getProductsByIds = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.product.findMany({
        where: {
            id: {
                in: ids
            }
        }
    });
});
exports.getProductsByIds = getProductsByIds;
const getProductDashboard = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield prisma.product.findMany({
        include: {
            category: true
        }
    });
    const totalStockCount = products.reduce((acc, product) => { var _a; return acc + ((_a = product.stock) !== null && _a !== void 0 ? _a : 0); }, 0);
    const totalInventoryValue = products.reduce((acc, product) => { var _a, _b; return acc + ((_a = product.price) !== null && _a !== void 0 ? _a : 0) * ((_b = product.stock) !== null && _b !== void 0 ? _b : 0); }, 0);
    return {
        totalStockCount,
        totalInventoryValue,
    };
});
exports.getProductDashboard = getProductDashboard;

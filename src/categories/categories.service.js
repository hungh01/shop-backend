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
exports.getCategoriesById = exports.getProductCategories = exports.addProductCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addProductCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.productCategory.create({
        data: Object.assign({}, data)
    });
});
exports.addProductCategory = addProductCategory;
const getProductCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.productCategory.findMany({
        include: {
            products: true
        }
    });
});
exports.getProductCategories = getProductCategories;
const getCategoriesById = (categoryId, page, limitPage) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma.productCategory.findFirst({
        where: { id: categoryId },
        include: {
            products: true
        }
    });
    const products = category === null || category === void 0 ? void 0 : category.products;
    const startIndex = (page - 1) * limitPage;
    const endIndex = startIndex + limitPage;
    const paginatedProducts = products === null || products === void 0 ? void 0 : products.slice(startIndex, endIndex);
    return {
        page,
        pageLimit: limitPage,
        totalPages: Math.ceil(((products === null || products === void 0 ? void 0 : products.length) || 0) / limitPage),
        totalProducts: (products === null || products === void 0 ? void 0 : products.length) || 0,
        paginatedProducts
    };
});
exports.getCategoriesById = getCategoriesById;

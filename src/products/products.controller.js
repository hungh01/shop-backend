"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getProductDashboard = exports.getProductsByIds = exports.getProductsByName = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const productService = __importStar(require("./products.service"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_product_request_1 = require("./dto/create-product.request");
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, productCategoryName, stock, page, pageLimit } = req.query;
    console.log('Query:', stock);
    try {
        const products = yield productService.getProducts(productName || '', productCategoryName || '', stock || '-1');
        const startIndex = ((parseInt(page, 10) || 1) - 1) * (parseInt(pageLimit, 10) || 10);
        const endIndex = startIndex + (parseInt(pageLimit, 10) || 10);
        const paginatedProducts = products.slice(startIndex, endIndex);
        res.json({
            page: parseInt(page, 10) || 1,
            pageLimit: parseInt(pageLimit, 10) || 10,
            totalPages: Math.ceil(products.length / (parseInt(pageLimit, 10) || 10)),
            totalProducts: products.length,
            paginatedProducts,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield productService.getProductById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dto = (0, class_transformer_1.plainToInstance)(create_product_request_1.CreateProductRequest, req.body);
    const errors = yield (0, class_validator_1.validate)(dto);
    if (errors.length > 0) {
        res.status(400).json({ message: 'Invalid input', errors });
        return;
    }
    if (!req.file) {
        res.status(400).json({ message: 'Image file is required' });
        return;
    }
    try {
        const product = yield productService.createProduct(req.body, req.file.filename);
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Update product request body:', req.body);
    const dto = (0, class_transformer_1.plainToInstance)(create_product_request_1.CreateProductRequest, req.body);
    const errors = yield (0, class_validator_1.validate)(dto);
    if (errors.length > 0) {
        res.status(400).json({ message: 'Invalid input', errors });
        return;
    }
    try {
        const productId = req.params.id;
        const updatedProduct = yield productService.updateProduct(productId, req.body, ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '');
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(updatedProduct);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const deletedProduct = yield productService.deleteProduct(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
const getProductsByName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const products = yield productService.getProductsByName(name);
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductsByName = getProductsByName;
const getProductsByIds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.params.ids.split(',').map(id => parseInt(id));
        console.log('IDs:', ids);
        const products = yield productService.getProductsByIds(ids);
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductsByIds = getProductsByIds;
const getProductDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productService.getProductDashboard();
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductDashboard = getProductDashboard;

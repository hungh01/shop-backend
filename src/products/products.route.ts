import { Router } from "express";

import * as productController from "./products.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { CreateProductRequest } from "./dto/create-product.request";
import { CreateProductCategoryRequest } from "../categories/dto/create-product-category.request";
import { upload } from "../middlewares/uploadImage.middleware";

const router = Router();


router.get("/", productController.getProducts);
router.get("/search", productController.getProductsByName);
router.get("/dashboard", authMiddleware, productController.getProductDashboard);
router.get("/:id", productController.getProductById);
router.get("/cart/:ids", productController.getProductsByIds);
router.post("/", authMiddleware, upload.single('image'), productController.createProduct);
router.post("/:id", authMiddleware, upload.single('image'), productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);


export default router;
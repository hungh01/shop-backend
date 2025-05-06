import { Router } from "express";
import * as categoriesController from "./categories.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CreateProductCategoryRequest } from "./dto/create-product-category.request";
import { validateRequest } from "../middlewares/validate.middleware";


const router = Router();


router.get("/", categoriesController.getProductCategories);
router.post("/", authMiddleware, validateRequest(CreateProductCategoryRequest), categoriesController.addProductCategory);
router.get("/:categoryId", categoriesController.getCategoriesById);


export default router;
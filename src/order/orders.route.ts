import { Router } from "express";

import * as ordersController from "./orders.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", ordersController.addOder);
router.get("/", authMiddleware, ordersController.getOrders);
router.get("/orderbyuser", authMiddleware, ordersController.getOrderByUserId);
router.put("/:id", authMiddleware, ordersController.updateOrder);
router.get("/revenue", authMiddleware, ordersController.getOrderDashboard);

export default router;
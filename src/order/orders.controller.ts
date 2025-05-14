import { NextFunction, Request, Response } from "express";

import * as orderService from "./orders.service";


export const addOder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await orderService.addOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
}
export const getOrderByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({ message: "User's not found" });
            return;
        }
        const orders = await orderService.getOrderByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.getOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id;
        const updatedOrder = await orderService.updateOrder(orderId, req.body.status);
        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
}

export const getOrderDashboard = async (req: Request, res: Response, next: NextFunction) => {
    const type = req.query.type as string;
    try {
        const orders = await orderService.getOrderDashboard(type);
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}
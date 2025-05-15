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
exports.getOrderDashboard = exports.updateOrder = exports.getOrders = exports.getOrderByUserId = exports.addOder = void 0;
const orderService = __importStar(require("./orders.service"));
const addOder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderService.addOrder(req.body);
        res.status(201).json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.addOder = addOder;
const getOrderByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(400).json({ message: "User's not found" });
            return;
        }
        const orders = yield orderService.getOrderByUserId(userId);
        res.status(200).json(orders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrderByUserId = getOrderByUserId;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderService.getOrders();
        res.status(200).json(orders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const updatedOrder = yield orderService.updateOrder(orderId, req.body.status);
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrder = updateOrder;
const getOrderDashboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.query.type;
    try {
        const orders = yield orderService.getOrderDashboard(type);
        res.status(200).json(orders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrderDashboard = getOrderDashboard;

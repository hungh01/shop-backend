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
exports.getOrderDashboard = exports.getProductByOrderId = exports.updateOrder = exports.getOrders = exports.getOrderByUserId = exports.addOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const addOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return yield prisma.order.create({
        data: {
            totalPrice: order.totalPrice,
            userId: (_a = order.userId) !== null && _a !== void 0 ? _a : null,
            name: order.name,
            phone: order.phone,
            address: order.address,
            city: order.city,
            district: order.district,
            ward: order.ward,
            status: 'Chờ xác nhận',
            orderItems: {
                create: order.orderItems.map((item) => ({
                    quantity: item.quantity,
                    product: {
                        connect: {
                            id: item.productId,
                        },
                    },
                })),
            },
        },
    });
});
exports.addOrder = addOrder;
const getOrderByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.order.findMany({
        where: {
            userId: Number(userId),
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
});
exports.getOrderByUserId = getOrderByUserId;
const getOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.order.findMany({
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });
});
exports.getOrders = getOrders;
const updateOrder = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('status', status);
    if (status === 'Hoàn thành') {
        const products = yield (0, exports.getProductByOrderId)(id);
        console.log('products', products);
        if (products) {
            products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                yield prisma.product.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        stock: {
                            decrement: (_a = item.quantity) !== null && _a !== void 0 ? _a : 0,
                        },
                    },
                });
            }));
        }
    }
    return yield prisma.order.update({
        where: {
            id: Number(id),
        },
        data: {
            status,
        },
    });
});
exports.updateOrder = updateOrder;
const getProductByOrderId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma.order.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (order) {
        return order.orderItems.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
        }));
    }
    return [];
});
exports.getProductByOrderId = getProductByOrderId;
const getOrderDashboard = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma.order.findMany({
        where: {
            status: 'Hoàn thành',
            updatedAt: type === 'daily'
                ? {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
                }
                : type === 'weekly'
                    ? {
                        gte: new Date(new Date().setDate(new Date().getDate() - 84)), // Last 3 weeks
                    }
                    : {
                        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // Last 12 months
                    },
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
    if (type === 'daily') {
        return getDailyRevenue(orders);
    }
    else if (type === 'weekly') {
        return getWeeklyRevenue(orders);
    }
    else if (type === 'monthly') {
        return getMonthlyRevenue(orders);
    }
    else {
        throw new Error('Invalid type');
    }
});
exports.getOrderDashboard = getOrderDashboard;
const getDailyRevenue = (orders) => {
    const dailyRevenue = orders.reduce((acc, order) => {
        var _a, _b;
        const date = order.updatedAt.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const existingEntry = acc.find((entry) => entry.name === date);
        if (existingEntry) {
            existingEntry.sales += (_a = order.totalPrice) !== null && _a !== void 0 ? _a : 0;
        }
        else {
            acc.push({ name: date, sales: (_b = order.totalPrice) !== null && _b !== void 0 ? _b : 0 });
        }
        return acc;
    }, []);
    return dailyRevenue;
};
const getWeeklyRevenue = (orders) => {
    const weeklyRevenue = orders.reduce((acc, order) => {
        var _a, _b;
        const weekNumber = Math.floor((order.updatedAt.getTime() - new Date(order.updatedAt.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
        const year = order.updatedAt.getFullYear();
        const key = `${year}-W${weekNumber}`;
        const existingEntry = acc.find((entry) => entry.name === key);
        if (existingEntry) {
            existingEntry.sales += (_a = order.totalPrice) !== null && _a !== void 0 ? _a : 0;
        }
        else {
            acc.push({ name: key, sales: (_b = order.totalPrice) !== null && _b !== void 0 ? _b : 0 });
        }
        return acc;
    }, []);
    return weeklyRevenue;
};
const getMonthlyRevenue = (orders) => {
    const monthlyRevenue = orders.reduce((acc, order) => {
        var _a, _b;
        const month = order.updatedAt.getMonth() + 1; // Months are 0-indexed
        const year = order.updatedAt.getFullYear();
        const key = `${year}-${month}`;
        const existingEntry = acc.find((entry) => entry.name === key);
        if (existingEntry) {
            existingEntry.sales += (_a = order.totalPrice) !== null && _a !== void 0 ? _a : 0;
        }
        else {
            acc.push({ name: key, sales: (_b = order.totalPrice) !== null && _b !== void 0 ? _b : 0 });
        }
        return acc;
    }, []);
    return monthlyRevenue;
};

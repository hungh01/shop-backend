import { PrismaClient } from "@prisma/client";
import { OrderRequest } from "./dto/order.request";

const prisma = new PrismaClient();


export const addOrder = async (order: OrderRequest) => {
    return await prisma.order.create({
        data: {
            totalPrice: order.totalPrice,
            userId: order.userId ?? null,
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

}

export const getOrderByUserId = async (userId: string) => {
    return await prisma.order.findMany({
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
}

export const getOrders = async () => {
    return await prisma.order.findMany({
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
}

export const updateOrder = async (id: string, status: string) => {
    console.log('status', status);
    if (status === 'Hoàn thành') {
        const products = await getProductByOrderId(id);
        console.log('products', products);
        if (products) {
            products.map(async (item) => {
                await prisma.product.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        stock: {
                            decrement: item.quantity ?? 0,
                        },
                    },
                });
            });
        }
    }
    return await prisma.order.update({
        where: {
            id: Number(id),
        },
        data: {
            status,
        },
    });
}

export const getProductByOrderId = async (id: string) => {
    const order = await prisma.order.findUnique({
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
}

export const getOrderDashboard = async (type: string) => {
    const orders = await prisma.order.findMany({
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
    } else if (type === 'weekly') {
        return getWeeklyRevenue(orders);
    } else if (type === 'monthly') {
        return getMonthlyRevenue(orders);

    }
    else {
        throw new Error('Invalid type');
    }
}

const getDailyRevenue = (orders: any[]) => {
    const dailyRevenue = orders.reduce((acc: { name: string; sales: number }[], order) => {
        const date = order.updatedAt.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const existingEntry = acc.find((entry) => entry.name === date);

        if (existingEntry) {
            existingEntry.sales += order.totalPrice ?? 0;
        } else {
            acc.push({ name: date, sales: order.totalPrice ?? 0 });
        }

        return acc;
    }, []);
    return dailyRevenue;
}
const getWeeklyRevenue = (orders: any[]) => {
    const weeklyRevenue = orders.reduce((acc: { name: string; sales: number }[], order) => {
        const weekNumber = Math.floor((order.updatedAt.getTime() - new Date(order.updatedAt.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7));
        const year = order.updatedAt.getFullYear();
        const key = `${year}-W${weekNumber}`;

        const existingEntry = acc.find((entry) => entry.name === key);

        if (existingEntry) {
            existingEntry.sales += order.totalPrice ?? 0;
        } else {
            acc.push({ name: key, sales: order.totalPrice ?? 0 });
        }

        return acc;
    }, []);
    return weeklyRevenue;
}

const getMonthlyRevenue = (orders: any[]) => {
    const monthlyRevenue = orders.reduce((acc: { name: string; sales: number }[], order) => {
        const month = order.updatedAt.getMonth() + 1; // Months are 0-indexed
        const year = order.updatedAt.getFullYear();
        const key = `${year}-${month}`;

        const existingEntry = acc.find((entry) => entry.name === key);

        if (existingEntry) {
            existingEntry.sales += order.totalPrice ?? 0;
        } else {
            acc.push({ name: key, sales: order.totalPrice ?? 0 });
        }

        return acc;
    }, []);
    return monthlyRevenue;
}
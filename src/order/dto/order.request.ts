export interface OrderRequest {
    orderItems: [{
        productId: number;
        quantity: number;
    }]
    userId?: number;
    name?: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    address: string;
    note?: string;
    totalPrice: number;
}
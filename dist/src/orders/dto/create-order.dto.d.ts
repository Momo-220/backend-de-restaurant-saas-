import { PaymentMethod } from '../../common/types/order.types';
export declare class CreateOrderItemDto {
    item_id: string;
    quantity: number;
    notes?: string;
}
export declare class CreateOrderDto {
    table_id?: string;
    customer_name?: string;
    customer_phone?: string;
    payment_method: PaymentMethod;
    notes?: string;
    items: CreateOrderItemDto[];
}

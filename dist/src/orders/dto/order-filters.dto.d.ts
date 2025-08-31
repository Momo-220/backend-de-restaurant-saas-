import { OrderStatus, PaymentMethod } from '../../common/types/order.types';
export declare class OrderFiltersDto {
    status?: OrderStatus;
    payment_method?: PaymentMethod;
    table_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
}

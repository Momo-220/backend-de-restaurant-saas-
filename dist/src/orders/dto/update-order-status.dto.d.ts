import { OrderStatus } from '../../common/types/order.types';
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
    reason?: string;
}

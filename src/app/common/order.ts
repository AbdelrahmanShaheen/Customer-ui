import { OrderItem } from "./order-item";

export class Order {
    constructor(public orderItems: OrderItem[] ,public userEmail: string,
                public couponCode: string, public totalPrice: number,
                public totalPriceAfterDiscount: number, public cvv: string,
                public cardNumber: string) {}
}

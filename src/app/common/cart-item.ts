import { Product } from "./product";

export class CartItem {
    id!: number;
    code!: string;
    name!: string;
    imgUrl!: string;
    price!: number;
    quantity!: number;
  
    constructor(product: Product) {
      this.id = product.id;
      this.code = product.code;
      this.name = product.name;
      this.imgUrl = product.imgUrl;
      this.price = product.price;
      this.quantity = 1;
    }
}

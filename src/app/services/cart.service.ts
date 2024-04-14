import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  couponServiceUrl: string = 'http://localhost:8080/api/coupons';
  currentTotalPrice: number = 0;
  couponCode: string = '';

  constructor(private httpClient: HttpClient) { }

  addToCart(cartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.price;
      totalQuantityValue += currentCartItem.quantity;
    }
    this.currentTotalPrice = totalPriceValue;
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
  applyCoupon(couponCode: string) {
    return this.httpClient.get(`${this.couponServiceUrl}/${couponCode}`);
  }
}

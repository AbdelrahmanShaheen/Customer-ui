import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  errorMessage: string = '';
  constructor(private cartService: CartService) {
    
  }
  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.computeCartTotals();
  }
  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }
  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
  }
  remove(cartItem: CartItem) {
    this.cartService.remove(cartItem);
  }
  applyCoupon(couponCode: string) {
    this.cartService.applyCoupon(couponCode).subscribe(
      (data: any) => {
        if (data.valid && data.currentNumberOfUsages < data.maxNumberOfUsages) {
          if (data.valueType === 'fixed') {
            this.cartService.totalPrice.next( this.cartService.currentTotalPrice - data.value);
          } else if (data.valueType === 'percentage') {
            this.cartService.totalPrice.next(this.cartService.currentTotalPrice * (1 - data.value / 100));
          }
          this.cartService.couponCode = couponCode;
          this.errorMessage = ''; // Clear the error message
        } else {
          this.errorMessage = 'The coupon is not valid or has reached its maximum number of usages.';
        }
      },
      error => {
        this.errorMessage = 'The coupon is not valid or has reached its maximum number of usages.';
      }
    );
  }
}

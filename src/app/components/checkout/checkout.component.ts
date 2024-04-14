import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../common/custom-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { OrderItem } from '../../common/order-item';
import { Order } from '../../common/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  error: string = '';

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private checkoutService: CheckoutService
             ) { }
  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        'email': new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'), CustomValidators.notOnlyWhitespace]),
        'cvv': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(4), Validators.maxLength(4), CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(16), Validators.maxLength(16), CustomValidators.notOnlyWhitespace]),
      }),
    });
    this.reviewCartDetails();
  }
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );  
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  get cvv() {
    return this.checkoutFormGroup.get('customer.cvv');
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('customer.cardNumber');
  }
  onSubmit() {
    console.log('Handling the submit button');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    const orderItems: OrderItem[] = this.cartService.cartItems.map(tempCartItem => new OrderItem(tempCartItem.code, tempCartItem.quantity));
    const order = new Order(orderItems, this.checkoutFormGroup.get('customer')?.value.email, this.cartService.couponCode, this.cartService.currentTotalPrice, this.totalPrice, this.checkoutFormGroup.get('customer')?.value.cvv, this.checkoutFormGroup.get('customer')?.value.cardNumber);
    console.log(order);
    this.checkoutService.placeOrder(order).subscribe({
      next: response => {
        alert("Your order has been received.");
        this.resetCart();
      },
      error: error => {
        this.error = "There was an error while placing the order. Please try again! | Check your card information.";
      }
    });
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
  }
}

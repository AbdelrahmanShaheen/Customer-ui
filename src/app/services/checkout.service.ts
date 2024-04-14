import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private baseUrl: string = 'http://localhost:8082/api/v1/orders/complete-checkout';
  
  constructor(private httpClient: HttpClient) { }

  placeOrder(order: any) {
    return this.httpClient.post(`${this.baseUrl}`, order);
  }
}

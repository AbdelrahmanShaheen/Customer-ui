import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8085/api/product';
  private categoryUrl = 'http://localhost:8085/api/category';
  
  constructor(private httpClient: HttpClient) { }
  
  getProduct(productCode: string) : Observable<Product>{
    console.log(productCode);
    const productUrl = `${this.baseUrl}/${productCode}`;
    return this.httpClient.get<Product>(productUrl);
  }
  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/category/${theCategoryId}`;
    return this.httpClient.get<Product[]>(searchUrl);
  }
  
  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<ProductCategory[]>(this.categoryUrl);    
  }

  searchProducts(keyword: string) {
    const searchUrl = `${this.baseUrl}/search?name=${keyword}`;
    return this.httpClient.get<Product[]>(searchUrl);
  }
}
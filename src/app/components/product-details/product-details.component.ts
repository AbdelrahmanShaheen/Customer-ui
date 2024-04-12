import { Component ,OnInit} from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  public product !: Product;
  
  constructor(private productService: ProductService ,
    private route: ActivatedRoute,
    private cartService: CartService) { }
    
    ngOnInit(): void {
      this.route.paramMap.subscribe(() => {
        this.handleProductDetails();
      });
  }
  handleProductDetails() {
    // get the "id" param string. convert string to a number using the "+" symbol
    const productCode: string = this.route.snapshot.paramMap.get('code')!;
    this.productService.getProduct(productCode).subscribe(
      data => {
        console.log(data);
        this.product = data;
      }
    )
  }
  
  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.price}`);
    let cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}

import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { CrudmediatorService } from '../../services/crud.service';
import { Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  productsMap: Map<number, Product> = new Map(); 
  total = 0;
  userId: number = Number(localStorage.getItem('userId'));

  constructor(
    private cartService: CartService,
    private crudService: CrudmediatorService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (data: Cart[]) => {
        this.cartItems = data;
        const productIds = [...new Set(data.map(item => item.productId))];

        if (productIds.length > 0) {
          this.loadProducts(productIds);
        } else {
          this.productsMap.clear();
          this.calculateTotal();
        }
      },
      error: err => console.error('Failed to load cart', err)
    });
  }

  loadProducts(productIds: number[]) {
    this.crudService.getUserProducts().subscribe({
      next: (products: Product[]) => {
        const cartProducts = products.filter(p => productIds.includes(p.id!));
        cartProducts.forEach(p => this.productsMap.set(p.id!, p));
        this.calculateTotal();
      },
      error: err => console.error('Failed to load products', err)
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/placeholder.jpg';
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      const product = this.productsMap.get(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  increment(cartItem: Cart) {
    this.cartService.incrementQuantity(this.userId, cartItem.productId).subscribe(() => {
      this.loadCart();
      this.cartService.updateCartCount(this.userId); 
    });
  }

  decrement(cartItem: Cart) {
    this.cartService.decrementOrRemove(this.userId, cartItem.productId).subscribe(() => {
      this.loadCart();
      this.cartService.updateCartCount(this.userId); 
    });
  }

  clearCart() {
    this.cartService.clearCart(this.userId).subscribe(() => {
      this.loadCart();
      this.cartService.updateCartCount(this.userId); 
    });
  }

  payWithRazorpay() {
    const options = {
      key: 'rzp_test_tDKvqnFFz8rTff',
      amount: this.total * 100,
      currency: 'INR',
      name: 'Twicenice Store',
      description: 'Thanks for shopping!',
      handler: (response: any) => {
        alert('Payment successful: ' + response.razorpay_payment_id);
        this.cartService.placeOrder(this.userId).subscribe({
          next: () => {
            alert('Order placed successfully!');
            this.loadCart(); 
          },
          error: err => {
            alert('Order failed to place');
            console.error(err);
          }
        });
      },
      prefill: {
        name: 'User',
        email: 'example@gmail.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  browseMore(): void {
    this.router.navigate(['/shop']);
  }

  moveToWishlist(productId: number): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        this.cartService.removeFromCart(this.userId, productId).subscribe({
          next: () => {
            this.loadCart();
            this.cartService.updateCartCount(this.userId);
            this.wishlistService.updateWishlistCount();
            alert('Moved to wishlist!');
          },
          error: err => console.error('Failed to remove from cart:', err)
        });
      },
      error: err => console.error('Failed to move to wishlist:', err)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CrudmediatorService } from '../../services/crud.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedCategory: string | null = null;
  wishlistProductIds: number[] = [];
  isLoading = true;
  error: string | null = null;

  readonly imageBaseUrl = 'http://localhost:8080/api/products/images/';

  constructor(
    private productService: CrudmediatorService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.loadWishlistStatus();

    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'];
      this.isLoading = true;
      this.error = null;

      const productObservable = this.selectedCategory 
        ? this.productService.getProductsByCategory(this.selectedCategory)
        : this.productService.getAllProducts();

      productObservable.subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading products:', err);
          this.error = 'Failed to load products. Please try again later.';
          this.isLoading = false;
        }
      });
    });
  }

  getImageUrl(imageFileName: string): string {
    return this.imageBaseUrl + imageFileName;
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder.jpg';
    img.onerror = null;
  }

  addToCart(productId: number) {
    const userId = Number(localStorage.getItem('userId')) || 1;
    const cartItem: Cart = {
      userId: userId,
      productId: productId,
      quantity: 1
    };

    this.cartService.addToCart(cartItem).subscribe({
  next: () => {
    alert('Product added to cart!');
    this.cartService.updateCartCount(userId); 
  },
  error: (err: any) => console.error('Error adding to cart:', err)
});

  }

  loadWishlistStatus() {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        this.wishlistProductIds = wishlist
          .map(item => item.id ?? -1)
          .filter(id => id !== -1);
      },
      error: (err: any) => console.error('Error loading wishlist:', err)
    });
  }

  isProductInWishlist(productId: number | undefined): boolean {
    return typeof productId === 'number' && this.wishlistProductIds.includes(productId);
  }

  toggleWishlist(product: Product) {
    if (product.id == null) return;

    if (this.isProductInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id).subscribe({
        next: () => {
          this.wishlistProductIds = this.wishlistProductIds.filter(id => id !== product.id);
           this.wishlistService.updateWishlistCount();
        },
        error: (err: any) => console.error('Error removing from wishlist:', err)
      });
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe({
        next: () => {
          this.wishlistProductIds = [...this.wishlistProductIds, product.id!];
           this.wishlistService.updateWishlistCount();
        },
        error: (err: any) => console.error('Error adding to wishlist:', err)
      });
    }
  }
}
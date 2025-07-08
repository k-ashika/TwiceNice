import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private cartService:CartService
  ) {}
userId: number = Number(localStorage.getItem('userId'));

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items.map(item => ({
          ...item,
          imageUrl: this.fixImageUrl(item.imageUrl)
        }));
      },
      error: (err) => console.error('Error loading wishlist:', err)
    });
  }

  private fixImageUrl(url: string): string {
    if (!url) return '/assets/placeholder.jpg';
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace(/^[\\/]+|[\\/]+$/g, '');
    return `/api/products/images/${cleanPath}`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/placeholder.jpg';
    img.style.padding = '0';
    img.style.objectFit = 'cover';
  }

  moveToCart(productId: number): void {
    this.wishlistService.moveToCart(productId).subscribe({
next: () => {
        this.loadWishlist();
        this.wishlistService.updateWishlistCount(); 
        this.cartService.updateCartCount(this.userId);
      },      error: err => console.error('Move to cart error:', err)
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
next: () => {
        this.loadWishlist();
        this.wishlistService.updateWishlistCount(); 
      },      error: err => console.error('Remove from wishlist error:', err)
    });
  }

  browseMore(): void {
    this.router.navigate(['/shop']);
  }
}
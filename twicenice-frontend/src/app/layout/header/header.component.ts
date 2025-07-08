import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,FormsModule,CommonModule,RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartCount: number = 0;
  wishlistCount: number = 0;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const userId = Number(localStorage.getItem('userId'));
      this.cartService.updateCartCount(userId);
      this.cartService.cartCount$.subscribe(count => this.cartCount = count);
      
      if (!this.isAdmin()) {
      this.wishlistService.updateWishlistCount();
      this.wishlistService.wishlistCount$.subscribe(count => this.wishlistCount = count);
    }
    }
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ROLE_ADMIN';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  loadWishlistCount(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (wishlistItems) => this.wishlistCount = wishlistItems.length,
      error: (err) => console.error('Error loading wishlist count:', err)
    });
  }
}
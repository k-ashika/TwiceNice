import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudmediatorService } from '../../services/crud.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  priceLimit = 10000;
  searchTerm: string = '';
  sortOption = '';
  itemsPerPage = 9;
  currentPage = 1;
  wishlistIds: Set<number> = new Set();

  constructor(
    private service: CrudmediatorService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getUserProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
      },
      error: (err) => console.error('Error loading products', err)
    });
    this.loadWishlist();
  }

  loadWishlist() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistIds = new Set(items.map((p: Product) => p.id!));
      },
      error: (err) => console.error('Error loading wishlist', err)
    });
  }

  isWishlisted(productId: number): boolean {
    return this.wishlistIds.has(productId);
  }

  toggleWishlist(product: Product) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add to wishlist!');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/shop' } });
      return;
    }

    if (this.wishlistIds.has(product.id!)) {
      this.wishlistService.removeFromWishlist(product.id!).subscribe({
        next: () => {
          this.wishlistIds.delete(product.id!);
          this.wishlistService.updateWishlistCount();
        },
        error: (err) => console.error('Error removing from wishlist', err)
      });
    } else {
      this.wishlistService.addToWishlist(product.id!).subscribe({
        next: () => {
          this.wishlistIds.add(product.id!);
          this.wishlistService.updateWishlistCount();
        },
        error: (err) => console.error('Error adding to wishlist', err)
      });
    }
  }

  extractCategories() {
    const allCategories = this.products.map(p => p.category);
    this.categories = Array.from(new Set(allCategories));
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p =>
      (this.selectedCategory === '' || p.category === this.selectedCategory) &&
      p.price <= this.priceLimit &&
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addToCart(product: Product) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart!');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/shop' } });
      return;
    }

    const userId = Number(localStorage.getItem('userId'));
    const cartItem = { userId, productId: product.id!, quantity: 1 };

    this.cartService.addToCart(cartItem).subscribe({
      next: () => {
        this.cartService.incrementCartCount();
        alert('Product added to cart!');
      },
      error: (err) => console.error('Error adding to cart:', err)
    });
  }

  sortProducts() {
    switch (this.sortOption) {
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        this.filteredProducts = [...this.products];
        this.filterProducts();
        break;
    }
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudmediatorService } from '../../services/crud.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
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

  constructor(private service: CrudmediatorService,private cartService:CartService) {}

  ngOnInit(): void {
    this.service.getUserProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
        console.log('Products received:', this.products);
      },
      error: (err) => console.error('Error loading products', err)
    });
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
  const userId = Number(localStorage.getItem('userId')); 
  const cartItem = {
    userId: userId,
    productId: product.id!,
    quantity: 1
  };

  console.log('Sending to backend:', cartItem);
  this.cartService.addToCart(cartItem).subscribe({
next: () => {
        alert('Product added to cart!');
        this.cartService.updateCartCount(userId); 
      },    error: (err) => console.error('Error adding to cart:', err)
  });
}
sortOption = '';

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
itemsPerPage = 9;
currentPage = 1;

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


// logClick(product: Product) {
//   console.log("Click is working:", product);
// }

}
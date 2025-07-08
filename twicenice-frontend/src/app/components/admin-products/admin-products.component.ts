import { Component, OnInit } from '@angular/core';
import { CrudmediatorService } from '../../services/crud.service.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0
  };
  isEditMode = false;
  selectedFile: File | null = null;
  baseImageUrl = 'http://localhost:8080/api/products/images/';
  fallbackImage = 'assets/no-image.png'; // Local fallback image

  constructor(private service: CrudmediatorService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.service.getAdminProducts().subscribe({
      next: (res) => this.products = res,
      error: (err) => {
        console.error('Error fetching products:', err);
        if (err.status === 403) {
          alert('You need admin privileges to access products');
          this.router.navigate(['/admin-dashboard']);
        }
      }
    });
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return this.fallbackImage;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    return this.baseImageUrl + imagePath;
  }

  handleImageError(event: any) {
    event.target.src = this.fallbackImage;
  }

  openAddModal() {
    this.isEditMode = false;
    this.selectedProduct = { name: '', description: '', price: 0, imageUrl: this.fallbackImage, category: '', stock: 0 };
    this.selectedFile = null;
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  }

  openEditModal(product: any) {
    this.isEditMode = true;
    this.selectedProduct = { ...product };
    this.selectedFile = null;
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.service.deleteProduct(id).subscribe({
        next: () => this.fetchProducts(),
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Delete failed: ' + err.message);
        }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProduct.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedProduct.imageUrl = this.fallbackImage;
    }
  }

  saveProduct() {
    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('category', this.selectedProduct.category);
    formData.append('stock', this.selectedProduct.stock.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode) {
      this.service.updateProduct(this.selectedProduct.id, formData).subscribe({
        next: () => {
          this.fetchProducts();
          const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
          if (modal) modal.hide();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          if (err.status === 403) {
            alert('Admin privileges required to update products');
          } else {
            alert('Update failed: ' + err.message);
          }
        }
      });
    } else {
      this.service.addProduct(formData).subscribe({
        next: () => {
          this.fetchProducts();
          const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
          if (modal) modal.hide();
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Add failed: ' + err.message);
        }
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

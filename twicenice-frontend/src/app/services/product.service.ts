import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      map(products => products.map(p => ({
        ...p,
        imageUrl: this.ensureCorrectImageUrl(p.imageUrl)
      })))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${category}`).pipe(
      map(products => products.map(p => ({
        ...p,
        imageUrl: this.ensureCorrectImageUrl(p.imageUrl)
      })))
    );
  }

  private ensureCorrectImageUrl(url: string): string {
    if (!url) return 'assets/placeholder.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    const cleanFilename = url.split(/[\\/]/).pop() || url;
    return `http://localhost:8080/api/products/images/${cleanFilename}`;
  }

  addProduct(product: Product, imageFile: File): Observable<Product> {
    const headers = this.getAuthHeaders();
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('stock', product.stock.toString());
    formData.append('image', imageFile);

    return this.http.post<Product>(`${this.baseUrl}/add`, formData, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
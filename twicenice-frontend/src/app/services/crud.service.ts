import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { Admin } from '../models/admin.model';
import { ReturnRequest } from '../models/return.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CrudmediatorService {

  // LIVE BACKEND URL
  private apiUrl = 'https://twicenice-backend-docker.onrender.com/api';
  private baseUrl = 'https://twicenice-backend-docker.onrender.com';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.map(p => ({
        ...p,
        imageUrl: this.constructImageUrl(p.imageUrl)
      })))
    );
  }

  getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/admin/products`);
  }

  addProduct(productForm: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/admin/products/add`, productForm);
  }

  updateProduct(id: number, productForm: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/admin/products/edit/${id}`, productForm);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/products/delete/${id}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/orders`);
  }

  updateOrderStatus(id: number, newStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/orders/${id}`, newStatus);
  }

  getAdminSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/summary`);
  }

  getAdminProfile(): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/admin/profile`);
  }

  updateAdminProfile(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/admin/profile`, admin);
  }

  getUserProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map(products => products.map(p => ({
        ...p,
        imageUrl: this.constructImageUrl(p.imageUrl)
      }))),
      catchError(error => {
        console.error('Error loading products:', error);
        return throwError(() => error);
      })
    );
  }

  private constructImageUrl(filename: string): string {
    if (!filename) return 'assets/placeholder.jpg';
    if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;

    const cleanFilename = filename.split(/[\\/]/).pop() || filename;

    return `${this.apiUrl}/products/images/${cleanFilename}`;
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/orders/${userId}`);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/orders/${orderId}`).pipe(
      tap(response => console.log('Delete response:', response)),
      catchError(error => {
        console.error('Detailed delete error:', error);
        throw error;
      })
    );
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/profile/${userId}`);
  }

  updateUserProfile(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/profile/${userId}`, userData);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/user/products/${id}`);
  }

  addToCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/cart/add/${productId}`, {});
  }

  requestReturn(orderId: number, reason: string, items: any[]): Observable<any> {

    const request = {
      orderId,
      reason,
      items: items.map(item => ({
        orderItemId: item.orderItemId,
        productId: item.productId,
        quantity: item.quantity,
        reason: item.reason,
        condition: item.condition || 'GOOD'
      }))
    };

    return this.http.post(`${this.apiUrl}/user/returns`, request).pipe(
      tap(response => console.log('Return created:', response)),
      catchError(error => {
        console.error('Error creating return:', error);
        throw error;
      })
    );
  }

  getUserReturns(userId: number): Observable<ReturnRequest[]> {
    return this.http.get<ReturnRequest[]>(`${this.apiUrl}/user/returns/${userId}`);
  }

  getAllReturns(): Observable<ReturnRequest[]> {
    return this.http.get<ReturnRequest[]>(`${this.apiUrl}/admin/returns`);
  }

  processReturn(returnId: number, action: string, comments: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/returns/${returnId}`, { action, comments });
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/user/orders/details/${orderId}`);
  }

  deleteReturn(returnId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/returns/${returnId}`);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}

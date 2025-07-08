import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { Admin } from '../models/admin.model';
import { ReturnRequest } from '../models/return.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CrudmediatorService {
  private apiUrl = 'http://localhost:8080/api';
  private baseUrl = 'http://localhost:8080';
  
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/api/products`).pipe(
      map(products => products.map(p => ({
        ...p,
        imageUrl: this.constructImageUrl(p.imageUrl)
      })))
    );
  }

  getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8080/api/admin/products');
  }

  addProduct(productForm: FormData): Observable<Product> {
    return this.http.post<Product>('http://localhost:8080/api/admin/products/add', productForm);
  }

  updateProduct(id: number, productForm: FormData): Observable<Product> {
    return this.http.put<Product>(`http://localhost:8080/api/admin/products/edit/${id}`, productForm);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/admin/products/delete/${id}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get('http://localhost:8080/api/admin/users');
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/admin/users/${id}`);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/admin/orders');
  }

  updateOrderStatus(id: number, newStatus: string): Observable<any> {
    return this.http.put(`http://localhost:8080/api/admin/orders/${id}`, newStatus);
  }

  getAdminSummary(): Observable<any> {
    return this.http.get('http://localhost:8080/api/admin/summary');
  }

  getAdminProfile(): Observable<Admin> {
    return this.http.get<Admin>('http://localhost:8080/api/admin/profile');
  }

  updateAdminProfile(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>('http://localhost:8080/api/admin/profile', admin);
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
    return `http://localhost:8080/api/products/images/${cleanFilename}`;
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/category/${category}`);
  }

  getUserOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/user/orders/${userId}`);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(
      `http://localhost:8080/api/user/orders/${orderId}`
    ).pipe(
      tap(response => console.log('Delete response:', response)),
      catchError(error => {
        console.error('Detailed delete error:', error);
        throw error;
      })
    );
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/user/profile/${userId}`);
  }

  updateUserProfile(userId: number, userData: any): Observable<any> {
    return this.http.put(`http://localhost:8080/api/user/profile/${userId}`, userData);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`http://localhost:8080/api/user/products/${id}`);
  }

  addToCart(productId: number): Observable<any> {
    return this.http.post(`http://localhost:8080/api/user/cart/add/${productId}`, {});
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

    return this.http.post(
      `http://localhost:8080/api/user/returns`,
      request
    ).pipe(
      tap(response => console.log('Return created:', response)),
      catchError(error => {
        console.error('Error creating return:', error);
        if (error.status === 401) {
          console.error('Authentication error - token might be invalid');
        }
        throw error;
      })
    );
  }

  getUserReturns(userId: number): Observable<ReturnRequest[]> {
    return this.http.get<ReturnRequest[]>(
      `${this.apiUrl}/user/returns/${userId}`
    ).pipe(
      catchError(error => {
        console.error('Error fetching returns:', error);
        return throwError(() => error);
      })
    );
  }
  
  getAllReturns(): Observable<ReturnRequest[]> {
    return this.http.get<ReturnRequest[]>(
      `${this.apiUrl}/admin/returns`
    ).pipe(
      tap(response => console.log('Returns received:', response)),
      catchError(error => {
        console.error('Error fetching returns:', error);
        if (error.status === 403) {
          console.error('Admin role required');
        }
        throw error;
      })
    );
  }

  processReturn(returnId: number, action: string, comments: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/admin/returns/${returnId}`,
      { action, comments }
    ).pipe(
      tap(response => console.log('Return processed:', response)),
      catchError(error => {
        console.error('Error processing return:', error);
        throw error;
      })
    );
  }
  
  private decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Token decode error:', e);
      return null;
    }
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(
      `http://localhost:8080/api/user/orders/details/${orderId}`
    ).pipe(
      catchError(error => {
        console.error('Error fetching order:', error);
        throw error;
      })
    );
  }
  
  deleteReturn(returnId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/user/returns/${returnId}`
    ).pipe(
      catchError(error => {
        console.error('Error deleting return:', error);
        throw error;
      })
    );
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:8080/api/wishlist';
 private wishlistCountSubject = new BehaviorSubject<number>(0);  
  wishlistCount$ = this.wishlistCountSubject.asObservable();  
  constructor(private http: HttpClient) {}
private handleError(error: HttpErrorResponse) {
    console.error('Wishlist Error:', error); 
    if (error.status === 401 || error.status === 403) {
      return throwError(() => new Error('Please login again to continue'));
    }
    return throwError(() => new Error('Operation failed. Please try again.'));
}
    getWishlist(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  updateWishlistCount(): void {
    this.getWishlist().subscribe({
      next: (items) => this.wishlistCountSubject.next(items.length),
      error: (err) => console.error('Wishlist count error:', err)
    });
  }
   addToWishlist(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${productId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

   moveToCart(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/move-to-cart/${productId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

   removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

}
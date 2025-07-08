import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Product[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}
updateCartCount(userId: number): void {
  this.getCartByUserId(userId).subscribe(cart => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCountSubject.next(totalItems);
  });
}
  // ➤ In-memory cart
  addProductToLocalCart(product: Product) {
    this.items.push(product);
  }

  getItems(): Product[] {
    return this.items;
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  // ✅ Updated backend URLs
  addToCart(cartItem: Cart): Observable<any> {
    console.log("Sending cart item to backend:", cartItem);
    return this.http.post('http://localhost:8080/api/user/cart/add', cartItem);
  }

  getCartByUserId(userId: number): Observable<Cart[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Cart[]>(`http://localhost:8080/api/user/cart/${userId}`, { headers }).pipe(
    catchError(error => {
      console.error('Cart fetch error:', error);
      return throwError(() => error);
    })
  );
}
  placeOrder(userId: number): Observable<any> {
  return this.http.post('http://localhost:8080/api/user/orders/place', { userId });
}

  incrementQuantity(userId: number, productId: number): Observable<any> {
  return this.http.put(`http://localhost:8080/api/user/cart/increment?userId=${userId}&productId=${productId}`, {});
}

decrementOrRemove(userId: number, productId: number): Observable<any> {
  return this.http.put(`http://localhost:8080/api/user/cart/decrement?userId=${userId}&productId=${productId}`, {});
}

  removeFromCart(userId: number, productId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/user/cart/remove?userId=${userId}&productId=${productId}`);
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/user/cart/clear/${userId}`);
  }
  getToken(): string | null {
  return localStorage.getItem('token');  // assuming you store JWT token in localStorage with key 'token'
}

  addReview(productId: number, review: any) {
  return this.http.post(`/api/user/reviews/${productId}`, review, {
    headers: { Authorization: `Bearer ${this.getToken()}` }
  });
}

}
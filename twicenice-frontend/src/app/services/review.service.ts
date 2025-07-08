import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

getReviewsByProductId(productId: number): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.baseUrl}/product/${productId}`);
}
canReviewProduct(productId: number, userId: number): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.get<boolean>(
        `${this.baseUrl}/can-review/${productId}`,
        { 
            headers,
            params: { userId: userId.toString() }
        }
    );
}
addReview(productId: number, review: Omit<Review, 'id' | 'product' | 'userName'>): Observable<Review> {
    const headers = this.getAuthHeaders();
    return this.http.post<Review>(
        `${this.baseUrl}/product/${productId}`, 
        review, 
        { headers }
    ).pipe(
        catchError(err => {
            console.error('Detailed error:', err);
            if (err.status === 401) {
                alert('Session expired. Please login again.');
            } else if (err.status === 403) {
                alert('You do not have permission to review this product.');
            }
            throw err;
        })
    );
}
getAllReviewsForAdmin(): Observable<Review[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<Review[]>('http://localhost:8080/api/reviews/admin/all', { headers });
}


deleteReviewById(reviewId: number): Observable<{message: string}> {
  const headers = this.getAuthHeaders();
  return this.http.delete<{message: string}>(
    `${this.baseUrl}/admin/delete/${reviewId}`,
    { headers }
  ).pipe(
    catchError(err => {
      console.error('Delete error:', err);
      if (err.status === 403) {
        alert('You need ADMIN privileges to delete reviews.');
      } else {
        alert('Failed to delete review');
      }
      throw err;
    })
  );
}

//   addReview(review: Review): Observable<Review> {
//     const headers = this.getAuthHeaders();
//     return this.http.post<Review>(`${this.baseUrl}/add`, review, { headers });
//   }


}

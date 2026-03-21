import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for auth URLs and image URLs
    if (req.url.includes('/api/auth/') || req.url.includes('/images/')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');

    // For public endpoints - send without token if none exists
    if (!token) {
      return next.handle(req).pipe(
        catchError(error => this.handleError(error))
      );
    }

    // Check token expiration
    const tokenData = this.decodeToken(token);
    if (tokenData && tokenData.exp * 1000 < Date.now()) {
      this.handleAuthError();
      return throwError(() => new Error('Token expired'));
    }

    // Verify admin role for admin endpoints
    if (req.url.includes('/api/admin/') && tokenData && tokenData.role !== 'ROLE_ADMIN') {
      console.error('Access denied - admin privileges required');
      return throwError(() => new Error('Admin access required'));
    }

    // Clone request with Authorization header
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(cloned).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.handleAuthError();
    }
    // Don't redirect on 403 - just pass the error through
    return throwError(() => error);
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  private handleAuthError() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}

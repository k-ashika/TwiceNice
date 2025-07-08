
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verify admin role and token expiration
    if (payload.role === 'ROLE_ADMIN' && payload.exp * 1000 > Date.now()) {
      return true;
    }
  } catch (e) {
    console.error('Token error:', e);
  }

  // Clear invalid token and redirect
  localStorage.removeItem('token');
  router.navigate(['/login']);
  return false;
};

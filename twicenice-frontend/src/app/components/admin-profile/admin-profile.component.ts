import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CrudmediatorService } from '../../services/crud.service';
import { Admin } from '../../models/admin.model';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  admin: Admin = { id: 0, name: '', email: '', password: '' };
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  passwordStrength = '';

  constructor(
    private service: CrudmediatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getAdminProfile().subscribe({
      next: (data) => (this.admin = data),
      error: (err) => (this.errorMessage = 'Failed to load profile')
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.passwordStrength = this.getPasswordStrength(value);
  }

  getPasswordStrength(password: string): string {
    if (!password) return '';
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const lengthValid = password.length >= 8;
    
    const strength = [hasUpper, hasLower, hasNumber, hasSpecial, lengthValid].filter(v => v).length;
    
    if (strength <= 2) return 'Weak';
    if (strength === 3 || strength === 4) return 'Moderate';
    return 'Strong';
  }

  updateProfile() {
    this.service.updateAdminProfile(this.admin).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Update failed. Please try again.';
        this.successMessage = '';
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrudmediatorService } from '../../services/crud.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId = Number(localStorage.getItem('userId'));
  profileForm!: FormGroup;
  showPassword = false;
  passwordStrength = '';

  constructor(private service: CrudmediatorService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      email: [{ value: '', disabled: true }],
      address: [''],
      password: ['']
    });

    this.service.getUserProfile(this.userId).subscribe(user => {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        address: user.address
      });
    });

    // Strength detector
    this.profileForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordStrength = this.getPasswordStrength(value);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(password: string): string {
    if (!password) return '';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W]/.test(password);
    const length = password.length;

    if (length > 8 && hasUpper && hasLower && hasNumber && hasSymbol) return 'Strong';
    if (length >= 6 && (hasUpper || hasLower) && hasNumber) return 'Medium';
    return 'Weak';
  }

  updateProfile(): void {
    const data = this.profileForm.getRawValue();
    this.service.updateUserProfile(this.userId, data).subscribe(() => {
      alert('Profile updated successfully!');
      this.profileForm.get('password')?.reset();
      this.passwordStrength = '';
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }
}

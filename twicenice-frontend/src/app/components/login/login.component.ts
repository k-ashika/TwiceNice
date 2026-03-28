import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };
  showPassword = false;
  rememberMe = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Load saved email if Remember Me was checked before
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.credentials.email = savedEmail;
      this.rememberMe = true;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    this.http.post<any>(`${environment.apiUrl}/api/auth/login`, this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('email', res.email);
        localStorage.setItem('userId', res.id);

        // Handle Remember Me
        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.credentials.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        if (res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
}

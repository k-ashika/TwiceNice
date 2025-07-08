import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    this.http.post<any>('http://localhost:8080/api/auth/login', this.credentials).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); 
        localStorage.setItem('email', response.email);
        localStorage.setItem('userId', response.id);

        // Redirect based on role
        if (response.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      err => {
        alert('Login failed. Please check your credentials and try again.');
      }
    );
  }
}
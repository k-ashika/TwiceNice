import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { email: '', password: '' };
  showPassword = false;
  rememberMe = false;
  private returnUrl = '/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
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

        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.credentials.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        if (res.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          // Redirect to the page they originally tried to visit
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
}

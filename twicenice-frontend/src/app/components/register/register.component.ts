import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    address: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:8080/api/auth/register', this.user).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Registration failed');
        console.error(err);
      }
    });
  }
  showPassword: boolean = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

}

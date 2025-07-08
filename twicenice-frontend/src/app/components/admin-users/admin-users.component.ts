import { Component, OnInit } from '@angular/core';
import { CrudmediatorService } from '../../services/crud.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(
    private service: CrudmediatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.service.getAllUsers().subscribe({
      next: (res) => this.users = res,
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure to delete this user?')) {
      this.service.deleteUser(id).subscribe(() => this.fetchUsers());
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
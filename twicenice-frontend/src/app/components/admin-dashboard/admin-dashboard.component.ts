import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CrudmediatorService } from '../../services/crud.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts'; 
import { ChartType } from 'chart.js';
import { Admin } from '../../models/admin.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  summary = {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalReviews: 0
  };

  recentOrders: any[] = [];
  recentReviews: any[] = [];

  pieChartLabels: string[] = ['PLACED', 'PAID', 'CANCELLED'];
  pieChartData: number[] = [0, 0, 0];
  pieChartType: ChartType = 'pie';

  chartData = {
    labels: this.pieChartLabels,
    datasets: [{ data: this.pieChartData }]
  };

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  constructor(private service: CrudmediatorService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSummary();
    this.fetchAdminProfile();
  }

  fetchSummary() {
    this.service.getAdminSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.recentOrders = data.recentOrders || [];
        this.recentReviews = data.recentReviews || [];

        
        const counts = data.orderStatusCounts || { PLACED: 0, PAID: 0, CANCELLED: 0 };

        this.pieChartData = [
          counts.PLACED || 0,
          counts.PAID || 0,
          counts.CANCELLED || 0
        ];

        this.chartData = {
          labels: this.pieChartLabels,
          datasets: [{ data: this.pieChartData }]
        };
      },
      error: (err) => console.error('Failed to fetch summary:', err)
    });
  }

  adminProfile: Admin = { id: 0, name: '', email: '', password: '' };

  fetchAdminProfile() {
    this.service.getAdminProfile().subscribe({
      next: (profile) => this.adminProfile = profile,
      error: (err) => console.error('Failed to load admin profile:', err)
    });
  }

  updateProfile() {
    this.service.updateAdminProfile(this.adminProfile).subscribe({
      next: () => alert('Profile updated successfully!'),
      error: () => alert('Update failed. Check console.')
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

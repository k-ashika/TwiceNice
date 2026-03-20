import { Component, OnInit } from '@angular/core';
import { CrudmediatorService } from '../../services/crud.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
declare var bootstrap: any;

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  newStatus: string = '';
  baseImageUrl = environment.apiUrl + '/api/products/images';

  constructor(private service: CrudmediatorService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.service.getAllOrders().subscribe({
      next: res => this.orders = res,
      error: err => console.error('Failed to fetch orders', err)
    });
  }

   getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return 'https://placehold.co/60x60?text=No+Image';
  return imagePath;
}

  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/60x60?text=Image+Error';
  }
  viewOrder(order: any) {
    this.selectedOrder = order;
    this.newStatus = order.status;

    setTimeout(() => {
      const modalEl = document.getElementById('orderModal');
      if (modalEl) {
        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();
      }
    }, 0);
  }

  updateStatus() {
    if (this.selectedOrder) {
      this.service.updateOrderStatus(this.selectedOrder.id, this.newStatus).subscribe({
        next: () => {
          alert('Status updated successfully!');
          this.selectedOrder.status = this.newStatus;
          this.closeModal();
          this.loadOrders();
        },
        error: () => alert('Failed to update status')
      });
    }
  }

  closeModal() {
    this.selectedOrder = null;
    const modalEl = document.getElementById('orderModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

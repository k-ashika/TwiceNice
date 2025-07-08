import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudmediatorService } from '../../services/crud.service';
import { Order } from '../../models/order.model';
import { OrderItem } from '../../models/order-item.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-return-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './return-request.component.html',
  styleUrls: ['./return-request.component.css']
})
export class ReturnRequestComponent implements OnInit {
  orderId!: number;
  order: Order = {
    id: 0,
    userId: 0,
    totalPrice: 0,
    status: '',
    createdAt: '',
    items: [],
    isReturnable: true,
    returnWindowEnd: ''
  };
  selectedItems: {[key: number]: boolean} = {};
  returnReasons: {[key: number]: string} = {};
  generalReason: string = '';
  isLoading = true;
  existingReturns: any[] = [];
  
  // Base64 encoded fallback image
  readonly fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOWZhIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNkZWUyZTYiIHN0cm9rZT0iI2FkYjViZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM0OTUwNTciPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudmediatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrderDetails();
  }

  loadOrderDetails() {
    this.isLoading = true;
    this.crudService.getOrderById(this.orderId).subscribe({
      next: (order: Order) => {
        this.order = order;
        this.order.items.forEach(item => {
          this.selectedItems[item.id] = false;
          this.returnReasons[item.id] = ''; // Initialize reason
        });
        this.loadExistingReturns();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading order:', err);
        if (err.status === 403) {
          this.router.navigate(['/login']);
        }
        this.isLoading = false;
      }
    });
  }

  loadExistingReturns() {
    if (!this.order?.userId) {
      this.isLoading = false;
      return;
    }
    
    this.crudService.getUserReturns(this.order.userId).subscribe({
      next: (returns) => {
        this.existingReturns = returns.filter(r => 
          r.orderId === this.orderId && 
          ['PENDING', 'APPROVED'].includes(r.status));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading returns:', err);
        this.isLoading = false;
      }
    });
  }

  getBadgeClass(status: string): string {
    switch(status.toUpperCase()) {
      case 'PLACED':
        return 'bg-success bg-opacity-10 text-success';
      case 'SHIPPED':
        return 'bg-warning text-dark';
      case 'DELIVERED':
        return 'bg-success text-white';
      case 'CANCELLED':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary';
    }
  }

  toggleItemSelection(item: OrderItem) {
    if (!this.canReturnItem(item)) return;
    
    this.selectedItems[item.id] = !this.selectedItems[item.id];
    if (!this.selectedItems[item.id]) {
      this.returnReasons[item.id] = ''; // Clear reason when unselected
    }
  }

  handleItemClick(item: OrderItem, event: MouseEvent) {
    if ((event.target as HTMLElement).closest('.reason-dropdown')) return;
    this.toggleItemSelection(item);
  }

  canReturnItem(item: OrderItem): boolean {
    if (!this.canReturnOrder()) return false;
    return !this.existingReturns.some(r => 
      r.items.some((ri: any) => 
        ri.productId === item.productId && 
        ['PENDING', 'APPROVED'].includes(r.status)));
  }

  canReturnOrder(): boolean {
    if (!this.order) return false;
    
    if (this.order.returnWindowEnd) {
      const windowEnd = new Date(this.order.returnWindowEnd);
      const now = new Date();
      return now <= windowEnd && 
             this.order.isReturnable !== false &&
             this.order.status === 'DELIVERED';
    }
    
    return false;
  }

  getReturnWindowEnd(): Date {
    if (!this.order?.createdAt) return new Date();
    const createdAt = new Date(this.order.createdAt);
    const returnWindowEnd = new Date(createdAt);
    returnWindowEnd.setDate(returnWindowEnd.getDate() + 30);
    return returnWindowEnd;
  }

  hasSelectedItems(): boolean {
    return Object.values(this.selectedItems).some(selected => selected);
  }

  hasSelectableItems(): boolean {
    return this.order?.items?.some(item => this.canReturnItem(item)) || false;
  }

  submitReturn() {
    if (!this.order || !this.canReturnOrder()) {
      alert('This order cannot be returned');
      return;
    }

    const selectedItems = this.order.items.filter(item => this.selectedItems[item.id]);
    if (selectedItems.length === 0) {
      alert('Please select at least one item to return');
      return;
    }

    // Check if all selected items have valid reasons
    const hasMissingReasons = selectedItems.some(item => {
      const reason = this.returnReasons[item.id] || '';
      return reason.trim() === '';
    });
    
    if (hasMissingReasons) {
      alert('Please provide reasons for all selected items');
      return;
    }

    const alreadyReturnedItems = selectedItems.filter(item => !this.canReturnItem(item));
    if (alreadyReturnedItems.length > 0) {
      alert('Some selected items already have active return requests');
      return;
    }

    const returnItems = selectedItems.map(item => ({
      orderItemId: item.id, 
      productId: item.productId, // FIX: Send productId instead of order item id
      quantity: item.quantity,
      reason: this.returnReasons[item.id],
      condition: 'GOOD'
    }));

    this.crudService.requestReturn(
      this.orderId,
      this.generalReason,
      returnItems
    ).subscribe({
      next: (response) => {
        alert('Return request submitted successfully!');
        this.router.navigate(['/returns/history']);
      },
      error: (err) => {
        console.error('Return failed:', err);
        alert(err.error?.message || 'Failed to submit return request');
      }
    });
  }

  handleImageError(event: any) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
    img.classList.add('image-error');
  }

  goBack() {
    this.router.navigate(['/orders']);
  }
}
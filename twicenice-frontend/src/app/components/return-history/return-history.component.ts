import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudmediatorService } from '../../services/crud.service';
import { ReturnRequest } from '../../models/return.model';
import { catchError, finalize } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-return-history',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './return-history.component.html',
  styleUrls: ['./return-history.component.css']
})
export class ReturnHistoryComponent implements OnInit {
  returns: ReturnRequest[] = [];
  filteredReturns: ReturnRequest[] | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  userId = Number(localStorage.getItem('userId'));

  constructor(private crudService: CrudmediatorService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      this.loadReturns(orderId);
    });
  }

  loadReturns(orderId?: number) {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.crudService.getUserReturns(this.userId).subscribe({
      next: (returns) => {
        if (orderId) {
          this.returns = returns.filter(r => r.orderId == orderId);
        } else {
          this.returns = returns;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading returns:', err);
        this.errorMessage = 'Failed to load return history. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  filterReturns(event: Event) {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    
    if (status === 'all') {
      this.filteredReturns = null;
    } else {
      this.filteredReturns = this.returns.filter(r => r.status === status);
    }
  }

  refreshReturns() {
    this.loadReturns();
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'APPROVED': return 'bg-success';
      case 'REJECTED': return 'bg-danger';
      case 'PROCESSED': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }

  deleteReturn(returnId: number) {
    if (confirm('Are you sure you want to cancel this return request?')) {
      this.crudService.deleteReturn(returnId).subscribe({
        next: () => {
          this.returns = this.returns.filter(r => r.id !== returnId);
          if (this.filteredReturns) {
            this.filteredReturns = this.filteredReturns.filter(r => r.id !== returnId);
          }
        },
        error: (err) => {
          console.error('Error deleting return:', err);
          this.errorMessage = err.error?.message || 'Failed to cancel return request. Please try again.';
        }
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { CrudmediatorService } from '../../services/crud.service';
import { ReturnRequest } from '../../models/return.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ReturnRequestWithForm extends ReturnRequest {
  selectedAction: string;
  adminComments: string;
}

@Component({
  selector: 'app-admin-returns',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-returns.component.html',
  styleUrls: ['./admin-returns.component.css']
})
export class AdminReturnsComponent implements OnInit {
  returns: ReturnRequestWithForm[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private crudService: CrudmediatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReturns();
  }

  loadReturns() {
    this.isLoading = true;
    this.errorMessage = '';
    this.crudService.getAllReturns().subscribe({
      next: (returns) => {
        this.returns = returns.map(r => ({
          ...r,
          selectedAction: 'PENDING',
          adminComments: ''
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load returns', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load return requests';
        if (err.status === 403) {
          this.errorMessage = 'Admin privileges required';
        }
      }
    });
  }
getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return 'assets/placeholder.jpg';
  
  // Strip any localhost prefix that was incorrectly prepended by the backend
  const cleaned = imageUrl.replace(
    /^https?:\/\/localhost:\d+\/api\/products\/images\//,
    ''
  );
  
  // Now cleaned is the actual Cloudinary URL — return it directly
  if (cleaned.includes('://')) return cleaned;
  
  // Plain filename — build proper URL
  return this.crudService.constructImageUrl(cleaned);
}
  handleImageError(event: any) {
  event.target.src = 'assets/placeholder.jpg';
  event.target.onerror = null; // prevent infinite loop
}

  processReturn(returnId: number) {
    const returnReq = this.returns.find(r => r.id === returnId);
    if (!returnReq) return;

    this.errorMessage = '';
    this.crudService.processReturn(
      returnId, 
      returnReq.selectedAction, 
      returnReq.adminComments
    ).subscribe({
      next: () => {
        this.loadReturns();
      },
      error: (err) => {
        console.error('Error processing return:', err);
        this.errorMessage = err.status === 403 
          ? 'Admin privileges required' 
          : 'Failed to process return';
      }
    });
  }

  getBadgeClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'badge-pending';
      case 'APPROVED': return 'badge-approved';
      case 'REJECTED': return 'badge-rejected';
      case 'PROCESSED': return 'badge-processed';
      default: return 'badge-secondary';
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CrudmediatorService } from '../../services/crud.service';
import { Review } from '../../models/review.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-review',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-review.component.html',
  styleUrls: ['./admin-review.component.css']
})
export class AdminReviewComponent implements OnInit {
  reviews: Review[] = [];
  isLoading = true;
  errorMessage = '';
  baseImageUrl = environment.apiUrl + '/api/products/images/';

  constructor(
    private reviewService: ReviewService,
    private crudService: CrudmediatorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    setTimeout(() => {
    if (this.reviews.length > 0) {
      console.log('First review product image:', this.reviews[0].product?.imageUrl);
    }
  }, 1000);
  }

  loadReviews() {
    this.isLoading = true;
    this.errorMessage = '';
    this.reviewService.getAllReviewsForAdmin().subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load reviews';
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return 'assets/placeholder.jpg';
  if (imagePath.includes('://')) return imagePath; 
  return this.crudService.constructImageUrl(imagePath);
}

  handleImageError(event: any) {
    event.target.src = 'assets/placeholder.jpg';
  }

  deleteReview(id: number) {
    if (confirm("Are you sure you want to delete this review?")) {
      this.reviewService.deleteReviewById(id).subscribe({
        next: (response) => {
          this.reviews = this.reviews.filter(r => r.id !== id);
          console.log(response.message);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to delete review';
          if (err.status === 403) {
            this.errorMessage = 'Admin privileges required';
          }
        }
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

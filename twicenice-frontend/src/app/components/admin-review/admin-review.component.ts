import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
  baseImageUrl = 'http://localhost:8080/api/products/images/';

  constructor(private reviewService: ReviewService, private router: Router) {}

  ngOnInit(): void {
    this.loadReviews();
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
    if (!imagePath) return 'https://via.placeholder.com/60';
    if (imagePath.startsWith('http')) return imagePath;
    return this.baseImageUrl + imagePath;
  }

  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/60';
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
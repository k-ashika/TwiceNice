import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CrudmediatorService } from '../../services/crud.service';
import { Product } from '../../models/product.model';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  id!: number;
  reviews: Review[] = [];
  isLoggedIn: boolean = false;
  canReview: boolean = false;
  isInWishlist: boolean = false;
  today: Date = new Date();

  newReview: Review = {
    userId: 0,
    rating: 0,
    comment: '',
    userName: ''
  };

  constructor(
    private route: ActivatedRoute,
    private service: CrudmediatorService,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getProductById(this.id).subscribe(prod => {
      this.product = prod;
      this.loadReviews();
      this.checkWishlistStatus();
      const userId = Number(localStorage.getItem('userId'));
      if (userId) {
        this.checkCanReview(userId);
      }
    });
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  checkCanReview(userId: number) {
    this.reviewService.canReviewProduct(this.id, userId).subscribe({
      next: (canReview) => this.canReview = canReview,
      error: (err) => console.error('Error checking review eligibility:', err)
    });
  }

  loadReviews() {
    this.reviewService.getReviewsByProductId(this.id).subscribe(data => {
      this.reviews = data;
    });
  }

  submitReview() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const reviewToSubmit = {
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      userId: userId
    };

    this.reviewService.addReview(this.id, reviewToSubmit).subscribe({
      next: () => {
        alert("Thank you for your review!");
        this.newReview.comment = '';
        this.newReview.rating = 0;
        this.loadReviews();
        this.checkCanReview(userId);
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert(err.error?.message || "Failed to submit review. Please try again.");
      }
    });
  }

  addToCart(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.service.addToCart(this.product.id!).subscribe(() => {
      alert('Product added to cart!');
      this.cartService.updateCartCount(userId); 
    });
  }

  checkWishlistStatus(): void {
    if (this.isLoggedIn && localStorage.getItem('token')) {
      this.wishlistService.getWishlist().subscribe({
        next: (items) => {
          this.isInWishlist = items.some(item => item.id === this.product.id);
        },
        error: (err) => console.error('Error checking wishlist:', err)
      });
    }
  }

  toggleWishlist(): void {
    if (!this.isLoggedIn) {
      alert('Please login to use the wishlist');
      return;
    }

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id!).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.wishlistService.updateWishlistCount(); 
        },
        error: (err) => console.error('Error removing from wishlist:', err)
      });
    } else {
      this.wishlistService.addToWishlist(this.product.id!).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.wishlistService.updateWishlistCount(); 
        },
        error: (err) => console.error('Error adding to wishlist:', err)
      });
    }
  }
}

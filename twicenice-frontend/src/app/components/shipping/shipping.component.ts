import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h2>Shipping Policy</h2>
      <p>We ship across India. Standard delivery takes 5-7 business days.</p>
      <p>Free shipping on orders above ₹999.</p>
    </div>
  `
})
export class ShippingComponent {}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  userId: number = 1; 
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartByUserId(this.userId).subscribe(items => {
      this.cartItems = items;
      this.totalAmount = this.cartItems.reduce(
        (sum, item) => sum + item.quantity * 100, 
        0
      );
    });
  }

  // payNow() {
  //   this.http
  //     .post<any>(`http://localhost:8080/api/payment/create-order?amount=${this.totalAmount}`, {})
  //     .subscribe(
  //       (res) => {
  //         const options = {
  //           key: 'rzp_test_YourKeyID', 
  //           amount: res.amount,
  //           currency: res.currency,
  //           name: 'TwiceNice Thrift',
  //           description: 'Fashion Payment',
  //           order_id: res.id,
  //           handler: (response: any) => {
  //             alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
  //             this.router.navigate(['/orders']);
  //           },
  //           prefill: {
  //             name: 'Test User',
  //             email: 'test@example.com',
  //             contact: '9999999999'
  //           },
  //           theme: {
  //             color: '#00a86b'
  //           }
  //         };

  //         const rzp = new (window as any).Razorpay(options);
  //         rzp.open();
  //       },
  //       (err) => {
  //         alert('Error creating order');
  //         console.error(err);
  //       }
  //     );
  // }
  payNow() {
  this.http
    .post<any>(`http://localhost:8080/api/payment/create-order?amount=${this.totalAmount}`, {})
    .subscribe(
      (res) => {
        const options = {
          key: 'rzp_test_YourKeyID',
          amount: res.amount,
          currency: res.currency,
          name: 'TwiceNice Thrift',
          description: 'Fashion Payment',
          order_id: res.id,
          handler: (response: any) => {
            // ✅ Razorpay payment was successful
            alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);

            this.cartService.placeOrder(this.userId).subscribe({
              next: () => {
                alert('Order placed successfully!');
                this.router.navigate(['/orders']);
              },
              error: (orderError) => {
                alert('Payment succeeded, but order placement failed.');
                console.error('Order placement error:', orderError);
              }
            });
          },
          modal: {
            // ✅ Runs when user closes Razorpay window (without paying)
            ondismiss: () => {
              alert('Payment popup closed. Your order was not placed.');
            }
          },
          prefill: {
            name: 'Test User',
            email: 'test@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#00a86b'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },
      (err) => {
        alert('Error creating Razorpay order');
        console.error(err);
      }
    );
}


}

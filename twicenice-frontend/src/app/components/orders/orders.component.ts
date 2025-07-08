import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudmediatorService } from '../../services/crud.service';
import { Order } from '../../models/order.model';
import { FormsModule } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  userId = Number(localStorage.getItem('userId'));
  userEmail = localStorage.getItem('email');
  orders: Order[] = [];
  userAddress: string = '';


   readonly fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPgogIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOWZhIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNkZWUyZTYiIHN0cm9rZT0iI2FkYjViZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNTAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM0OTUwNTciPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';


  constructor(private crudService: CrudmediatorService,private router:Router,private sanitizer: DomSanitizer ) {
    (pdfMake as any).vfs = pdfFonts.vfs;

  }

  ngOnInit(): void {
    this.loadOrders();
     this.crudService.getUserProfile(this.userId).subscribe({
    next: (user: any) => {
      this.userAddress = user.address || 'Address not available';
    },
    error: err => console.error('Error loading user profile:', err)
  });
  }

  loadOrders() {
    this.crudService.getUserOrders(this.userId).subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: err => console.error('Error loading orders:', err)
    });
  }

  deleteOrder(orderId: number) {
  if (confirm("Are you sure you want to delete this order?")) {
    this.crudService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== orderId);
      },
      error: err => {
        console.error("Failed to delete order", err);
        if (err.status === 403) {
          alert("You don't have permission to delete this order");
        }
      }
    });
  }
}
  

 getImageUrl(imageFileName: string | null): string {
    if (!imageFileName) return 'https:/placehold.co/60x60';
    return `http://localhost:8080/images/${imageFileName}`;
  }
  handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'https://placehold.co/60x60'; 
}
viewReturnHistory(orderId: number) {
  this.router.navigate(['/returns/history'], { 
    queryParams: { orderId: orderId } 
  });
}
// getImageUrl(imagePath: string | null): string {
//   if (!imagePath) return this.fallbackImage;
  
//   // Remove any host/port if present
//   const cleanPath = imagePath.replace(/^https?:\/\/[^\/]+/, '');
  
//   // If it's already a proper path, use as-is
//   if (cleanPath.startsWith('/images/')) {
//     return `http://localhost:8080${cleanPath}`;
//   }
  
//   // Default case
//   return `http://localhost:8080/images/${cleanPath}`;
// }

// handleImageError(event: Event) {
//   const img = event.target as HTMLImageElement;
//   console.warn('Image load failed:', img.src);
//   img.src = this.fallbackImage;
//   img.classList.add('image-error');
// }

//  getImageUrl(imageFileName: string | null): string {
//     if (!imageFileName) return 'assets/images/fallback-product.png';
    
//     // Check if it's already a full URL
//     if (imageFileName.startsWith('http')) {
//       return imageFileName;
//     }
    
//     return `http://localhost:8080/images/${imageFileName}`;
//   }
//  handleImageError(event: Event) {
//     const imgElement = event.target as HTMLImageElement;
//     imgElement.src = 'assets/images/fallback-product.png';
//     imgElement.classList.add('image-error');
//   }

  // getBadgeClass(status: string): string {
  //   switch (status) {
  //     case 'PLACED':
  //       return 'bg-primary';
  //     case 'SHIPPED':
  //       return 'bg-warning text-dark';
  //     case 'DELIVERED':
  //       return 'bg-success';
  //     case 'CANCELLED':
  //       return 'bg-danger';
  //     default:
  //       return 'bg-secondary';
  //   }
  // }
getBadgeClass(status: string): string {
  switch (status) {
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
  async downloadInvoice(order: any) {
  const total = order.totalPrice;
  const gst = +(total * 0.18).toFixed(2);
  const subtotal = +(total - gst).toFixed(2);
  const shippingAddress = this.userAddress;


  const logoDataUrl = await this.getBase64ImageFromURL('assets/twicenice-logo.png');

  const docDefinition = {
    content: [
      {
        columns: [
          {
            image: logoDataUrl,
            width: 60
          },
          {
            stack: [
              { text: 'TWICE NICE', style: 'brand' },
              { text: 'Elegance Delivered', style: 'tagline' }
            ],
            alignment: 'right'
          }
        ]
      },
      { text: 'INVOICE', style: 'header' },
      { text: `Order ID: ${order.id}`, margin: [0, 5] },
      { text: `Customer Email: ${this.userEmail}` },
      { text: `Shipping Address: ${shippingAddress}` },
      { text: `Date: ${new Date(order.createdAt).toLocaleString()}`, margin: [0, 0, 0, 10] },

      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            ['Product', 'Unit Price', 'Qty', 'Total'],
            ...order.items.map((item: any) => [
              item.productName,
              `₹${(item.price / item.quantity).toFixed(2)}`,
              item.quantity,
              `₹${item.price.toFixed(2)}`
            ])
          ]
        },
        layout: {
          fillColor: (rowIndex: number) => rowIndex === 0 ? '#eeeeee' : null
        }
      },

      { text: '\n' },
      {
        columns: [
          { text: '' },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                ['Subtotal', `₹${subtotal}`],
                ['GST (18%)', `₹${gst}`],
                ['Total', `₹${total}`]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ]
      },

      {
        text: '\nThank you for shopping with us!',
        style: 'footer'
      }
    ],
    styles: {
      brand: {
        fontSize: 18,
        bold: true,
        color: '#3b5998'
      },
      tagline: {
        fontSize: 10,
        italics: true,
        color: '#777'
      },
      header: {
        fontSize: 22,
        bold: true,
        margin: [0, 15, 0, 10]
      },
      footer: {
        fontSize: 12,
        italics: true,
        alignment: 'center',
        color: '#888'
      }
    }
  };

  pdfMake.createPdf(docDefinition as any).download(`invoice_${order.id}.pdf`);
}
getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = error => reject(error);
    img.src = url;
  });
}
 isReturnable(order: Order): boolean {
    if (!order.returnWindowEnd) return false;
    
    const windowEnd = new Date(order.returnWindowEnd);
    return order.status === 'DELIVERED' && 
           new Date() <= windowEnd && 
           order.isReturnable !== false;
  }
initiateReturn(order: Order) {
  this.router.navigate(['/returns/request', order.id]);
}  
browseMore(): void {
    this.router.navigate(['/shop']);
  }
}
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { UserProductsComponent } from './components/user-products/user-products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ReturnRequestComponent } from './components/return-request/return-request.component';
import { ReturnHistoryComponent } from './components/return-history/return-history.component';
import { AdminReturnsComponent } from './components/admin-returns/admin-returns.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  // { path: 'register', component: RegisterComponent },
  {
  path: 'register',
  loadComponent: () =>
    import('./components/register/register.component').then(m => m.RegisterComponent)
}
,
  // { path: 'login', component: LoginComponent },
  {
  path: 'login',
  loadComponent: () =>
    import('./components/login/login.component').then(m => m.LoginComponent)
}
,
  { path: 'orders', component: OrdersComponent },
  { path: 'checkout', component: CheckoutComponent },
 { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },


{ path: 'admin-products', component: AdminProductsComponent, canActivate: [adminGuard] },
{ path: 'admin-orders', component: AdminOrdersComponent, canActivate: [adminGuard] },
{ path: 'admin-users', component: AdminUsersComponent, canActivate: [adminGuard] },
{
  path: 'admin-profile',
  loadComponent: () =>
    import('./components/admin-profile/admin-profile.component').then(m => m.AdminProfileComponent),
  canActivate: [adminGuard]
}
,
{
  path: 'shop',
  loadComponent: () =>
    import('./components/user-products/user-products.component').then(m => m.UserProductsComponent)
}
,
{ path: 'cart', component: CartComponent },
{ path: 'orders', loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
{
  path: 'user/profile',
  loadComponent: () => import('./components/user-profile/user-profile.component').then(m => m.UserProfileComponent)
},
{
  path: 'product/:id',
  loadComponent: () =>
    import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
},

{
  path: 'admin-reviews',
  loadComponent: () => 
    import('./components/admin-review/admin-review.component').then(m => m.AdminReviewComponent),
  canActivate: [adminGuard]
},
{ path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent) }
,
{
  path: 'returns/request/:id',
  loadComponent: () => 
    import('./components/return-request/return-request.component').then(m => m.ReturnRequestComponent)
},
{
  path: 'returns/history',
  loadComponent: () => 
    import('./components/return-history/return-history.component').then(m => m.ReturnHistoryComponent)
},
{
  path: 'admin-returns',
  loadComponent: () => 
    import('./components/admin-returns/admin-returns.component').then(m => m.AdminReturnsComponent),
  canActivate: [adminGuard]
}
];

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./main/welcome/welcome.module').then(m => m.WelcomeModule) },
  {
    path: 'products',
    loadChildren: () => import('./main/products/products.module').then(m => m.ProductsModule),
  },
  {
    path: 'orders',
    loadChildren: () => import('./main/orders/orders.module').then(m => m.OrdersModule),
  },
  {
    path: 'promotions',
    loadChildren: () => import('./main/promotions/promotions.module').then(m => m.PromotionsModule),
  },
  {
    path: 'finance',
    loadChildren: () => import('./main/finance/finance.module').then(m => m.FinanceModule),
  },
  {
    path: 'store',
    loadChildren: () => import('./main/store/store.module').then(m => m.StoreModule),
  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

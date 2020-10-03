import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { LayoutModule } from 'app/layout/layout.module';
import { Routes, RouterModule } from '@angular/router';
import { UserRouteAccessService } from '@vertical/core';
import { WebContentsComponent } from './web-contents/web-contents.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
      },
      {
        path: 'promotions',
        loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsModule),
      },
      {
        path: 'finance',
        loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule),
      },
      {
        path: 'store',
        loadChildren: () => import('./store/store.module').then(m => m.StoreModule),
      },
      {
        path: 'web-contents',
        loadChildren: () => import('./web-contents/web-contents.module').then(m => m.WebContentsModule),
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
    canActivate: [UserRouteAccessService],
  },

];

@NgModule({
  declarations: [MainComponent, WebContentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule
  ]
})
export class MainModule { }

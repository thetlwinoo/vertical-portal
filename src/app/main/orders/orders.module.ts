import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageOrdersModule } from './manage-orders/manage-orders.module';
import { ManageReturnOrdersModule } from './manage-return-orders/manage-return-orders.module';
import { ManageReviewsModule } from './manage-reviews/manage-reviews.module';

const MODULES = [
  ManageOrdersModule,
  ManageReturnOrdersModule,
  ManageReviewsModule
];

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: '/manage-orders' },
  { path: 'manage-orders', loadChildren: () => import('./manage-orders/manage-orders.module').then(m => m.ManageOrdersModule) },
  {
    path: 'manage-return-orders',
    loadChildren: () => import('./manage-return-orders/manage-return-orders.module').then(m => m.ManageReturnOrdersModule)
  },
  { path: 'manage-reviews', loadChildren: () => import('./manage-reviews/manage-reviews.module').then(m => m.ManageReviewsModule) },
  { path: '**', redirectTo: 'manage-orders' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    ...MODULES
  ]
})
export class OrdersModule { }

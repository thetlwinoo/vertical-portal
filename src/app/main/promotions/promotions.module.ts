import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampaignManagementModule } from './campaign-management/campaign-management.module';
import { FreeShippingModule } from './free-shipping/free-shipping.module';
import { SellerVoucherModule } from './seller-voucher/seller-voucher.module';
import { DiscountTypesModule } from './discount-types/discount-types.module';
import { DiscountsModule } from './discounts/discounts.module';

const MODULES = [
  CampaignManagementModule,
  FreeShippingModule,
  SellerVoucherModule,
  DiscountTypesModule,
  DiscountsModule
];

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: '/campaign-management' },
  {
    path: 'campaign-management',
    loadChildren: () => import('./campaign-management/campaign-management.module').then(m => m.CampaignManagementModule)
  },
  {
    path: 'free-shipping',
    loadChildren: () => import('./free-shipping/free-shipping.module').then(m => m.FreeShippingModule)
  },
  {
    path: 'seller-voucher',
    loadChildren: () => import('./seller-voucher/seller-voucher.module').then(m => m.SellerVoucherModule)
  },
  {
    path: 'discount-types',
    loadChildren: () => import('./discount-types/discount-types.module').then(m => m.DiscountTypesModule)
  },
  {
    path: 'discounts',
    loadChildren: () => import('./discounts/discounts.module').then(m => m.DiscountsModule)
  },
  { path: '**', redirectTo: 'campaign-management' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    ...MODULES
  ]
})
export class PromotionsModule { }

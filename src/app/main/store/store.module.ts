import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuppliersModule } from './suppliers/suppliers.module';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { ProductBrandsModule } from './product-brands/product-brands.module';
import { ShippingFeeChartModule } from './shipping-fee-chart/shipping-fee-chart.module';

const MODULES = [
  SuppliersModule,
  CustomersModule,
  UsersModule,
  AddressesModule,
  ProductBrandsModule,
  ShippingFeeChartModule
];

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: '/suppliers' },
  {
    path: 'shipping-fee-chart',
    loadChildren: () => import('./shipping-fee-chart/shipping-fee-chart.module').then(m => m.ShippingFeeChartModule)
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'addresses',
    loadChildren: () => import('./addresses/addresses.module').then(m => m.AddressesModule)
  },
  {
    path: 'product-brands',
    loadChildren: () => import('./product-brands/product-brands.module').then(m => m.ProductBrandsModule)
  },
  { path: '**', redirectTo: 'suppliers' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    ...MODULES
  ]
})
export class StoreModule { }

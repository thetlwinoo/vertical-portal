import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuppliersModule } from './suppliers/suppliers.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';

const MODULES = [
  SuppliersModule,
  UsersModule,
  AddressesModule
];

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: '/suppliers' },
  {
    path: 'suppliers',
    loadChildren: () => import('./suppliers/suppliers.module').then(m => m.SuppliersModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'addresses',
    loadChildren: () => import('./addresses/addresses.module').then(m => m.AddressesModule)
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

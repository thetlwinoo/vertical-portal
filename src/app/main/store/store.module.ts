import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageStoreModule } from './manage-store/manage-store.module';

const MODULES = [
  ManageStoreModule
];

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: '/manage-store' },
  {
    path: 'manage-store',
    loadChildren: () => import('./manage-store/manage-store.module').then(m => m.ManageStoreModule)
  },
  { path: '**', redirectTo: 'manage-store' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    ...MODULES
  ]
})
export class StoreModule { }

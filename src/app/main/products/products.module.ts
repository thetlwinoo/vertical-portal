import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const ROUTES = [
  // { path: '', pathMatch: 'full', redirectTo: 'manage-products' },
  { path: 'manage-products', loadChildren: () => import('./manage-products/manage-products.module').then(m => m.ManageProductsModule) },
  { path: 'manage-images', loadChildren: () => import('./manage-images/manage-images.module').then(m => m.ManageImagesModule) },
  {
    path: 'manage-categories',
    loadChildren: () => import('./manage-categories/manage-categories.module').then(m => m.ManageCategoiresModule)
  },
  { path: 'batch-upload', loadChildren: () => import('./batch-upload/batch-upload.module').then(m => m.BatchUploadModule) },
  { path: 'product-update', loadChildren: () => import('./products-update/products-update.module').then(m => m.ProductsUpdateModule) },
  { path: 'product-choice', loadChildren: () => import('./product-choice/product-choice.module').then(m => m.ProductChoiceModule) },
  { path: '**', redirectTo: 'manage-products' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(ROUTES)],
})
export class ProductsModule { }

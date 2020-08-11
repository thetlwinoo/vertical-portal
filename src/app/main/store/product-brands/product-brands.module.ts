import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VsSharedModule } from '@vertical/shared.module';
import { ProductBrandsComponent } from './product-brands.component';
import { ProductBrandViewEditComponent } from './product-brand-view-edit/product-brand-view-edit.component';
import { ProductBrandAddComponent } from './product-brand-add/product-brand-add.component';
import { productBrandsRoute } from './product-brands.route';

const COMPONENTS = [
  ProductBrandsComponent,
  ProductBrandViewEditComponent,
  ProductBrandAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(productBrandsRoute),
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class ProductBrandsModule { }

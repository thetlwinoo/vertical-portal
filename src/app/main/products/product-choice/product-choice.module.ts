import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VsSharedModule } from '@vertical/shared.module';
import { productChoiceRoute } from './product-choice-route';
import { ProductChoiceComponent } from './product-choice.component';
import { ProductChoiceAddComponent } from './product-choice-add/product-choice-add.component';
import { ProductChoiceViewEditComponent } from './product-choice-view-edit/product-choice-view-edit.component';
import { ProductAttributesComponent } from './product-attributes/product-attributes.component';
import { ProductOptionsComponent } from './product-options/product-options.component';

const COMPONENTS = [
  ProductChoiceComponent,
  ProductChoiceAddComponent,
  ProductChoiceViewEditComponent,
  ProductAttributesComponent,
  ProductOptionsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(productChoiceRoute),
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class ProductChoiceModule { }

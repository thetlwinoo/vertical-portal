import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';

import { DiscountTypesRoutingModule } from './discount-types-routing.module';
import { DiscountTypesComponent } from './discount-types.component';
import { DiscountTypesViewEditComponent } from './discount-types-view-edit/discount-types-view-edit.component';
import { DiscountTypesAddComponent } from './discount-types-add/discount-types-add.component';

const COMPONENTS = [
  DiscountTypesComponent,
  DiscountTypesViewEditComponent,
  DiscountTypesAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    VsSharedModule,
    DiscountTypesRoutingModule
  ],
  exports: [...COMPONENTS]
})
export class DiscountTypesModule { }

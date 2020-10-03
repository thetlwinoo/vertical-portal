import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';

import { DiscountsRoutingModule } from './discounts-routing.module';
import { DiscountsComponent } from './discounts.component';
import { DiscountsViewEditComponent } from './discounts-view-edit/discounts-view-edit.component';
import { DiscountsAddComponent } from './discounts-add/discounts-add.component';
import { DiscountDetailsComponent } from './discount-details/discount-details.component';
import { DiscountDetailsViewEditComponent } from './discount-details/discount-details-view-edit/discount-details-view-edit.component';

const COMPONENTS = [
  DiscountsComponent,
  DiscountsViewEditComponent,
  DiscountsAddComponent,
  DiscountDetailsViewEditComponent
];

@NgModule({
  declarations: [...COMPONENTS, DiscountDetailsComponent],
  imports: [
    VsSharedModule,
    DiscountsRoutingModule
  ],
  exports: [...COMPONENTS]
})
export class DiscountsModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VsSharedModule } from '@vertical/shared.module';
import { shoppingFeeChartRoute } from './shipping-fee-chart.route';
import { ShippingFeeChartComponent } from './shipping-fee-chart.component';

const COMPONENTS = [
  ShippingFeeChartComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    VsSharedModule,
    RouterModule.forChild(shoppingFeeChartRoute),
  ],
  exports: [...COMPONENTS]
})
export class ShippingFeeChartModule { }

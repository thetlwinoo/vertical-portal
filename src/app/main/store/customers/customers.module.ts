import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { CustomersComponent } from './customers.component';
import { CustomerViewEditComponent } from './customer-view-edit/customer-view-edit.component';
import { CustomerAddComponent } from './customer-add/customer-add.component';
import { customersRoute } from './customers.route';

const COMPONENTS = [
  CustomersComponent,
  CustomerViewEditComponent,
  CustomerAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(customersRoute),
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class CustomersModule { }

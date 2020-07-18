import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { AddressesComponent } from './addresses.component';
import { AddressViewEditComponent } from './address-view-edit/address-view-edit.component';
import { AddressAddComponent } from './address-add/address-add.component';
import { addressesRoute } from './addresses.route';

const COMPONENTS = [
  AddressesComponent,
  AddressViewEditComponent,
  AddressAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(addressesRoute),
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class AddressesModule { }

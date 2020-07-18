import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { SuppliersComponent } from './suppliers.component';
import { SupplierViewEditComponent } from './supplier-view-edit/supplier-view-edit.component';
import { SupplierAddComponent } from './supplier-add/supplier-add.component';
import { suppliersRoute } from './suppliers.route';

const COMPONENTS = [
  SuppliersComponent,
  SupplierViewEditComponent,
  SupplierAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(suppliersRoute),
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class SuppliersModule { }

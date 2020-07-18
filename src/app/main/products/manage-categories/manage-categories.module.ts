import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { ProductsSharedModule } from '../shared/products-shared.module';
import { ManageCategoriesComponent } from './manage-categories.component';

const COMPONENTS = [
  ManageCategoriesComponent
];

const ROUTES = [
  {
    path: '',
    component: ManageCategoriesComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_PORTAL'],
      defaultSort: 'id,asc',
      pageTitle: 'resourceApp.products.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(ROUTES),
    ProductsSharedModule,
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class ManageCategoiresModule { }

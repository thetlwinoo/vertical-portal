import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { SellerVoucherComponent } from './seller-voucher.component';

const COMPONENTS = [
  SellerVoucherComponent
];

const ROUTES = [
  {
    path: '',
    component: SellerVoucherComponent,
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
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class SellerVoucherModule { }

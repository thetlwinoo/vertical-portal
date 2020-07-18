import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { VsSharedModule } from '@vertical/shared.module';
import { TransactionOverviewComponent } from './transaction-overview.component';
import { UserRouteAccessService } from '@vertical/core';

const COMPONENTS = [
  TransactionOverviewComponent
];

const ROUTES = [
  {
    path: '',
    component: TransactionOverviewComponent,
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
export class TransactionOverviewModule { }

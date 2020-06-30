import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { ManageReviewsComponent } from './manage-reviews.component';

const COMPONENTS = [
  ManageReviewsComponent
];

const ROUTES = [
  {
    path: '',
    component: ManageReviewsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
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
export class ManageReviewsModule { }

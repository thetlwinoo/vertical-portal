import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { UsersComponent } from './users.component';
import { UserViewEditComponent } from './user-view-edit/user-view-edit.component';
import { UserAddComponent } from './user-add/user-add.component';

const COMPONENTS = [
  UsersComponent,
  UserViewEditComponent,
  UserAddComponent
];

const ROUTES = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_PORTAL'],
      defaultSort: 'id,asc',
      pageTitle: 'Users',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: UserAddComponent,
    data: {
      authorities: ['ROLE_PORTAL'],
      pageTitle: 'Supplier Create',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'details/:id/:handle',
    component: UserViewEditComponent,
    data: {
      authorities: ['ROLE_PORTAL'],
      pageTitle: 'User Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'details/:id',
    component: UserViewEditComponent,
    data: {
      authorities: ['ROLE_PORTAL'],
      pageTitle: 'User View',
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
export class UsersModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { UsersComponent } from './users.component';
import { UserViewEditComponent } from './user-view-edit/user-view-edit.component';
import { UserAddComponent } from './user-add/user-add.component';
import { usersRoute } from './users.route';

const COMPONENTS = [
  UsersComponent,
  UserViewEditComponent,
  UserAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(usersRoute),
    VsSharedModule
  ],
  exports: [...COMPONENTS]
})
export class UsersModule { }

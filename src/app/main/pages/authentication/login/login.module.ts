import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { VsSharedModule } from '@vertical/shared.module';

const routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, RouterModule.forChild(routes), VsSharedModule],
})
export class LoginModule { }

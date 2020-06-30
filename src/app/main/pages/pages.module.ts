import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from 'app/main/pages/authentication/login/login.module';

const MODULES = [
    LoginModule,
];

@NgModule({
    declarations: [],
    imports: [CommonModule, ...MODULES],
})
export class PagesModule { }

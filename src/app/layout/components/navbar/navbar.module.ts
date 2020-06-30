import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VsSharedModule } from '@vertical/shared.module';
import { NavbarComponent } from './navbar.component';

@NgModule({
    declarations: [NavbarComponent],
    imports: [
        CommonModule,
        VsSharedModule,
    ],
    exports: [
        NavbarComponent
    ]
})
export class NavbarModule { }

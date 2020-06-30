import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VsSharedModule } from '@vertical/shared.module';

import { Layout1Component } from './layout1.component';

@NgModule({
  declarations: [
    Layout1Component
  ],
  imports: [
    RouterModule,
    VsSharedModule,
    CommonModule,
  ],
  exports: [
    Layout1Component
  ]
})
export class Layout1Module { }

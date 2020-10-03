import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';

import { WebImageTypesRoutingModule } from './web-image-types-routing.module';
import { WebImageTypesComponent } from './web-image-types.component';
import { WebImageTypeViewEditComponent } from './web-image-type-view-edit/web-image-type-view-edit.component';
import { WebImageTypeAddComponent } from './web-image-type-add/web-image-type-add.component';

const COMPONENTS = [
  WebImageTypesComponent,
  WebImageTypeViewEditComponent,
  WebImageTypeAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    VsSharedModule,
    WebImageTypesRoutingModule
  ],
  exports: [...COMPONENTS]
})
export class WebImageTypesModule { }

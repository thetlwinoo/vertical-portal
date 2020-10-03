import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';

import { WebConfigRoutingModule } from './web-config-routing.module';
import { WebConfigComponent } from './web-config.component';
import { WebConfigViewEditComponent } from './web-config-view-edit/web-config-view-edit.component';
import { WebConfigAddComponent } from './web-config-add/web-config-add.component';

const COMPONENTS = [
  WebConfigComponent,
  WebConfigViewEditComponent,
  WebConfigAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    VsSharedModule,
    WebConfigRoutingModule
  ],
  exports: [...COMPONENTS]
})
export class WebConfigModule { }

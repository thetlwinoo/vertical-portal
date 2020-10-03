import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';

import { WebThemesRoutingModule } from './web-themes-routing.module';
import { WebThemesComponent } from './web-themes.component';
import { WebThemesViewEditComponent } from './web-themes-view-edit/web-themes-view-edit.component';
import { WebThemesAddComponent } from './web-themes-add/web-themes-add.component';

const COMPONENTS = [
  WebThemesComponent,
  WebThemesViewEditComponent,
  WebThemesAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    VsSharedModule,
    WebThemesRoutingModule
  ],
  exports: [...COMPONENTS]
})
export class WebThemesModule { }

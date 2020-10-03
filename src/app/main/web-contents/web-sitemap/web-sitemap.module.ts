import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';

import { WebSitemapRoutingModule } from './web-sitemap-routing.module';
import { WebSitemapComponent } from './web-sitemap.component';
import { WebSitemapViewEditComponent } from './web-sitemap-view-edit/web-sitemap-view-edit.component';
import { WebSitemapAddComponent } from './web-sitemap-add/web-sitemap-add.component';

const COMPONENTS = [
  WebSitemapComponent,
  WebSitemapViewEditComponent,
  WebSitemapAddComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    VsSharedModule,
    WebSitemapRoutingModule
  ],
  exports: [...COMPONENTS]
})
export class WebSitemapModule { }

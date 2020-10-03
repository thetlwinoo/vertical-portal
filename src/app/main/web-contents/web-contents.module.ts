import { NgModule } from '@angular/core';
import { VsSharedModule } from '@vertical/shared.module';
// import { WebSitemapModule } from './web-sitemap/web-sitemap.module';
import { RouterModule } from '@angular/router';
import { WebContentsComponent } from './web-contents.component';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';

// const MODULES = [
//   WebSitemapModule
// ];

const ROUTES = [
  {
    path: '',
    component: WebContentsComponent,
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Manage Store',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'web-sitemap',
    loadChildren: () => import('./web-sitemap/web-sitemap.module').then(m => m.WebSitemapModule)
  },
  {
    path: 'web-image-types',
    loadChildren: () => import('./web-image-types/web-image-types.module').then(m => m.WebImageTypesModule)
  },
  {
    path: 'web-themes',
    loadChildren: () => import('./web-themes/web-themes.module').then(m => m.WebThemesModule)
  },
  {
    path: 'web-config',
    loadChildren: () => import('./web-config/web-config.module').then(m => m.WebConfigModule)
  },
];

@NgModule({
  declarations: [],
  imports: [
    VsSharedModule,
    RouterModule.forChild(ROUTES),
    // ...MODULES
  ]
})
export class WebContentsModule { }

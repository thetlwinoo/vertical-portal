import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { WebSitemapComponent } from './web-sitemap.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { WebSitemapViewEditComponent } from './web-sitemap-view-edit/web-sitemap-view-edit.component';
import { WebSitemapAddComponent } from './web-sitemap-add/web-sitemap-add.component';
import { WebSitemapService } from '@vertical/services';
import { IWebSitemap, WebSitemap } from '@vertical/models';
import { Observable, EMPTY, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WebSitemapResolve implements Resolve<IWebSitemap> {
  constructor(private service: WebSitemapService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IWebSitemap> | Observable<never> {
    const id = route.params.id;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<WebSitemap>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WebSitemap());
  }
}

const routes: Routes = [
  {
    path: '',
    component: WebSitemapComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Web Sitemap',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: WebSitemapAddComponent,
    resolve: {
      webSitemap: WebSitemapResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Sitemap Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WebSitemapViewEditComponent,
    resolve: {
      webSitemap: WebSitemapResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Sitemap Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WebSitemapViewEditComponent,
    resolve: {
      webSitemap: WebSitemapResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Sitemap View',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebSitemapRoutingModule { }

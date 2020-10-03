import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { WebThemesComponent } from './web-themes.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { WebThemesViewEditComponent } from './web-themes-view-edit/web-themes-view-edit.component';
import { WebThemesAddComponent } from './web-themes-add/web-themes-add.component';
import { WebThemesService } from '@vertical/services';
import { IWebThemes, WebThemes } from '@vertical/models';
import { Observable, EMPTY, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WebThemesResolve implements Resolve<IWebThemes> {
  constructor(private service: WebThemesService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IWebThemes> | Observable<never> {
    const id = route.params.id;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<WebThemes>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WebThemes());
  }
}

const routes: Routes = [
  {
    path: '',
    component: WebThemesComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Web Themes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: WebThemesAddComponent,
    resolve: {
      webThemes: WebThemesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Themes Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WebThemesViewEditComponent,
    resolve: {
      webThemes: WebThemesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Themes Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WebThemesViewEditComponent,
    resolve: {
      webThemes: WebThemesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Themes View',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebThemesRoutingModule { }

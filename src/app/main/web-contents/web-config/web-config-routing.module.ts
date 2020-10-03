import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { WebConfigComponent } from './web-config.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { WebConfigViewEditComponent } from './web-config-view-edit/web-config-view-edit.component';
import { WebConfigAddComponent } from './web-config-add/web-config-add.component';
import { WebConfigService } from '@vertical/services';
import { IWebConfig, WebConfig } from '@vertical/models';
import { Observable, EMPTY, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WebConfigResolve implements Resolve<IWebConfig> {
  constructor(private service: WebConfigService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IWebConfig> | Observable<never> {
    const id = route.params.id;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<WebConfig>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WebConfig());
  }
}

const routes: Routes = [
  {
    path: '',
    component: WebConfigComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Web Config',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: WebConfigAddComponent,
    resolve: {
      webConfig: WebConfigResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Config Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WebConfigViewEditComponent,
    resolve: {
      webConfig: WebConfigResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Config Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WebConfigViewEditComponent,
    resolve: {
      webConfig: WebConfigResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web Config View',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebConfigRoutingModule { }

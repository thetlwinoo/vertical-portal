import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { WebImageTypesComponent } from './web-image-types.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { WebImageTypeViewEditComponent } from './web-image-type-view-edit/web-image-type-view-edit.component';
import { WebImageTypeAddComponent } from './web-image-type-add/web-image-type-add.component';
import { WebImageTypesService } from '@vertical/services';
import { IWebImageTypes, WebImageTypes } from '@vertical/models';
import { Observable, EMPTY, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WebImageTypesResolve implements Resolve<IWebImageTypes> {
  constructor(private service: WebImageTypesService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IWebImageTypes> | Observable<never> {
    const id = route.params.id;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<WebImageTypes>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new WebImageTypes());
  }
}

const routes: Routes = [
  {
    path: '',
    component: WebImageTypesComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Web ImageTypes',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: WebImageTypeAddComponent,
    resolve: {
      webImageType: WebImageTypesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web ImageTypes Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WebImageTypeViewEditComponent,
    resolve: {
      webImageType: WebImageTypesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web ImageTypes Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WebImageTypeViewEditComponent,
    resolve: {
      webImageType: WebImageTypesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Web ImageTypes View',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebImageTypesRoutingModule { }

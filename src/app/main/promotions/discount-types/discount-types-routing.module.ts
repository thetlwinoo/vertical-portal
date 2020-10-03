import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DiscountTypesComponent } from './discount-types.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { DiscountTypesViewEditComponent } from './discount-types-view-edit/discount-types-view-edit.component';
import { DiscountTypesAddComponent } from './discount-types-add/discount-types-add.component';
import { DiscountTypesService } from '@vertical/services';
import { IDiscountTypes, DiscountTypes } from '@vertical/models';
import { Observable, EMPTY, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DiscountTypesResolve implements Resolve<IDiscountTypes> {
  constructor(private service: DiscountTypesService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IDiscountTypes> | Observable<never> {
    const id = route.params.id;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<DiscountTypes>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DiscountTypes());
  }
}

const routes: Routes = [
  {
    path: '',
    component: DiscountTypesComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Discount Types',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: DiscountTypesAddComponent,
    resolve: {
      discountTypes: DiscountTypesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Discount Types Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiscountTypesViewEditComponent,
    resolve: {
      discountTypes: DiscountTypesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Discount Types Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiscountTypesViewEditComponent,
    resolve: {
      discountTypes: DiscountTypesResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Discount Types View',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountTypesRoutingModule { }

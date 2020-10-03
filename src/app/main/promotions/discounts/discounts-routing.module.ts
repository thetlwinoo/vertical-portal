import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { DiscountsComponent } from './discounts.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { DiscountsViewEditComponent } from './discounts-view-edit/discounts-view-edit.component';
import { DiscountsAddComponent } from './discounts-add/discounts-add.component';
import { DiscountsService } from '@vertical/services';
import { IDiscounts, Discounts } from '@vertical/models';
import { Observable, EMPTY, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DiscountsResolve implements Resolve<IDiscounts> {
  constructor(private service: DiscountsService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<IDiscounts> | Observable<never> {
    const id = route.params.id;
    if (id) {
      return this.service.find(id).pipe(
        flatMap((res: HttpResponse<Discounts>) => {
          if (res.body) {
            return of(res.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Discounts());
  }
}

const routes: Routes = [
  {
    path: '',
    component: DiscountsComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Discounts',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: DiscountsAddComponent,
    resolve: {
      discounts: DiscountsResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Discounts Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiscountsViewEditComponent,
    resolve: {
      discounts: DiscountsResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Discounts Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiscountsViewEditComponent,
    resolve: {
      discounts: DiscountsResolve,
    },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Discounts View',
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountsRoutingModule { }

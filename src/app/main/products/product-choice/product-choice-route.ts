import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { IProductChoice, ProductChoice } from '@vertical/models';
import { ProductChoiceService } from '@vertical/services';
import { ProductChoiceComponent } from './product-choice.component';
import { ProductChoiceViewEditComponent } from './product-choice-view-edit/product-choice-view-edit.component';
import { ProductChoiceAddComponent } from './product-choice-add/product-choice-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class ProductChoiceResolve implements Resolve<IProductChoice> {
    constructor(private service: ProductChoiceService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IProductChoice> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((productChoice: HttpResponse<ProductChoice>) => {
                    if (productChoice.body) {
                        return of(productChoice.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new ProductChoice());
    }
}

export const productChoiceRoute: Routes = [
    {
        path: '',
        component: ProductChoiceComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams,
        },
        data: {
            authorities: [Authority.PORTAL],
            defaultSort: 'id,asc',
            pageTitle: 'Product Choice',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'create',
        component: ProductChoiceAddComponent,
        resolve: {
            productChoice: ProductChoiceResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Choice Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/edit',
        component: ProductChoiceViewEditComponent,
        resolve: {
            productChoice: ProductChoiceResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Choice Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/view',
        component: ProductChoiceViewEditComponent,
        resolve: {
            productChoice: ProductChoiceResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Choice View',
        },
        canActivate: [UserRouteAccessService],
    },
];

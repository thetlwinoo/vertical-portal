import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { IStockItems, StockItems, IProducts, Products } from '@vertical/models';
import { StockItemsService, ProductsService } from '@vertical/services';
import { ManageProductsComponent } from './manage-products.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
// import { ProductAddComponent } from './product-add/product-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class ManageProductsResolve implements Resolve<IProducts> {
    constructor(private service: ProductsService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IProducts> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: HttpResponse<Products>) => {
                    if (res.body) {
                        return of(res.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Products());
    }
}

export const routes: Routes = [
    {
        path: '',
        component: ManageProductsComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams,
        },
        data: {
            authorities: [Authority.PORTAL],
            defaultSort: 'id,asc',
            pageTitle: 'Manage Products',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'create',
        component: ProductUpdateComponent,
        resolve: {
            products: ManageProductsResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/edit',
        component: ProductUpdateComponent,
        resolve: {
            products: ManageProductsResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/view',
        component: ProductUpdateComponent,
        resolve: {
            products: ManageProductsResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product View',
        },
        canActivate: [UserRouteAccessService],
    },
];

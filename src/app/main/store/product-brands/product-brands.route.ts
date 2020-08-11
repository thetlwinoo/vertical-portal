import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { IProductBrand, ProductBrand } from '@vertical/models';
import { ProductBrandService } from '@vertical/services';
import { ProductBrandsComponent } from './product-brands.component';
import { ProductBrandViewEditComponent } from './product-brand-view-edit/product-brand-view-edit.component';
import { ProductBrandAddComponent } from './product-brand-add/product-brand-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class ProductBrandResolve implements Resolve<IProductBrand> {
    constructor(private service: ProductBrandService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IProductBrand> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: HttpResponse<ProductBrand>) => {
                    if (res.body) {
                        return of(res.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new ProductBrand());
    }
}

export const productBrandsRoute: Routes = [
    {
        path: '',
        component: ProductBrandsComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams,
        },
        data: {
            authorities: [Authority.PORTAL],
            defaultSort: 'id,asc',
            pageTitle: 'Manage Store',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'create',
        component: ProductBrandAddComponent,
        resolve: {
            productBrand: ProductBrandResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Brand Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/edit',
        component: ProductBrandViewEditComponent,
        resolve: {
            productBrand: ProductBrandResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Brand Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/view',
        component: ProductBrandViewEditComponent,
        resolve: {
            productBrand: ProductBrandResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Product Brand View',
        },
        canActivate: [UserRouteAccessService],
    },
];

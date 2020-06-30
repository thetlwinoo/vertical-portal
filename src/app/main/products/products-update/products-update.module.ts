import { NgModule, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';

import { Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import * as fromProducts from 'app/ngrx/products/reducers';
import { CategoryActions, FetchActions } from 'app/ngrx/products/actions';
import { IStockItems, StockItems, IProducts, Products } from '@vertical/models';
import { ProductsService, DocumentProcessService, StockItemsService } from '@vertical/services';
import { ProductsSharedModule } from '../shared/products-shared.module';

import { ProductsUpdateComponent } from './products-update.component';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { SkuFormComponent } from './sku-form/sku-form.component';
import { DecorationFormComponent } from './decoration-form/decoration-form.component';
import { InformationFormComponent } from './information-form/information-form.component';

const COMPONENTS = [
    ProductsUpdateComponent,
    BasicFormComponent,
    SkuFormComponent,
    DecorationFormComponent,
    InformationFormComponent
];

@Injectable({ providedIn: 'root' })
export class ProductsResolve implements Resolve<IProducts> {
    categoryId$: Observable<number>;

    constructor(private service: ProductsService, private store: Store<fromProducts.State>) {
        this.categoryId$ = this.store.pipe(select(fromProducts.getSelectedCategoryId));

        this.categoryId$.subscribe(categoryId => {
            this.store.dispatch(FetchActions.fetchProductChoice({ id: categoryId }));
        });
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProducts> {
        const id = route.params.id ? route.params.id : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((res: HttpResponse<Products>) => res.ok),
                map((res: HttpResponse<Products>) => {
                    const products = res.body;
                    this.store.dispatch(CategoryActions.selectCategory({ id: products.productCategoryId }));
                    this.store.dispatch(FetchActions.fetchStockItems({ productId: products.id }));
                    this.store.dispatch(FetchActions.fetchProductDocument({ id: products.id }));
                    return products;
                })
            );
        }
        return of(new Products());
    }
}

const ROUTES = [
    {
        path: '',
        component: ProductsUpdateComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams,
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'resourceApp.products.home.title',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'new',
        component: ProductsUpdateComponent,
        resolve: {
            products: ProductsResolve,
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PRODUCTS.TITLE',
        },
        // canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/edit',
        component: ProductsUpdateComponent,
        resolve: {
            products: ProductsResolve,
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PRODUCTS.TITLE',
        },
        // canActivate: [UserRouteAccessService],
    },
    {
        path: ':id',
        component: ProductsUpdateComponent,
        resolve: {
            products: ProductsResolve,
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PRODUCTS.TITLE',
        },
        // canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/:handle',
        component: ProductsUpdateComponent,
        resolve: {
            products: ProductsResolve,
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PRODUCTS.TITLE',
        },
        // canActivate: [UserRouteAccessService],
    },
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        RouterModule.forChild(ROUTES),
        ProductsSharedModule,
        VsSharedModule
    ],
    exports: [...COMPONENTS]
})
export class ProductsUpdateModule { }

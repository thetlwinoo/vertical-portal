import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { ManageImagesComponent } from './manage-images.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductsSharedModule } from '../shared/products-shared.module';

const COMPONENTS = [
    ManageImagesComponent,
    ProductListComponent
];

const ROUTES = [
    {
        path: '',
        component: ManageImagesComponent,
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
export class ManageImagesModule { }

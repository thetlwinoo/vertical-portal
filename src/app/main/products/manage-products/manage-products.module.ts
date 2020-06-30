import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { ManageProductsComponent } from './manage-products.component';
import { ProductsSharedModule } from '../shared/products-shared.module';

const COMPONENTS = [
    ManageProductsComponent
];

const ROUTES = [
    {
        path: '',
        component: ManageProductsComponent,
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
export class ManageProductsModule { }

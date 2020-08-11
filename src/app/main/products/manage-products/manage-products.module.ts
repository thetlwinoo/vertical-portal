import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from '@vertical/core';
import { VsSharedModule } from '@vertical/shared.module';
import { ManageProductsComponent } from './manage-products.component';
import { ProductsSharedModule } from '../shared/products-shared.module';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { StockItemUpdateComponent } from './product-update/stock-item-update/stock-item-update.component';
import { routes } from './manage-products.route';
import { BasicFormComponent } from './product-update/basic-form/basic-form.component';
import { InformationFormComponent } from './product-update/information-form/information-form.component';
import { DecorationFormComponent } from './product-update/decoration-form/decoration-form.component';
import { SkuFormComponent } from './product-update/sku-form/sku-form.component';

const COMPONENTS = [
    ManageProductsComponent,
    ProductUpdateComponent,
    StockItemUpdateComponent,
    BasicFormComponent,
    InformationFormComponent,
    DecorationFormComponent,
    SkuFormComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    imports: [
        RouterModule.forChild(routes),
        ProductsSharedModule,
        VsSharedModule
    ],
    exports: [...COMPONENTS]
})
export class ManageProductsModule { }

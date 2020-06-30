import { NgModule } from '@angular/core';
import { ImagesMissingFilterPipe } from './filters/manage-images-missing.pipe';
import { StockItemsFilterPipe } from './filters/stock-items-filter.pipe';

const PIPES = [
    ImagesMissingFilterPipe,
    StockItemsFilterPipe
];

@NgModule({
    declarations: [...PIPES],
    imports: [
    ],
    exports: [...PIPES],
    providers: [...PIPES]
})
export class ProductsSharedModule { }

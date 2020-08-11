import { IProductCategory } from './product-category.model';

export interface IProductCategoryCulture {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    productCategories?: IProductCategory[];
}

export class ProductCategoryCulture implements IProductCategoryCulture {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public productCategories?: IProductCategory[]
    ) { }
}

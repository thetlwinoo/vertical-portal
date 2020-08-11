export interface IProductCategoryLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    productCategoryName?: string;
    productCategoryId?: number;
}

export class ProductCategoryLocalize implements IProductCategoryLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public productCategoryName?: string,
        public productCategoryId?: number
    ) { }
}

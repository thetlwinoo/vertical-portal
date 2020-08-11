export interface IProductsLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    productName?: string;
    productId?: number;
}

export class ProductsLocalize implements IProductsLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public productName?: string,
        public productId?: number
    ) { }
}

export interface IProductBrandLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    productBrandName?: string;
    productBrandId?: number;
}

export class ProductBrandLocalize implements IProductBrandLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public productBrandName?: string,
        public productBrandId?: number
    ) { }
}

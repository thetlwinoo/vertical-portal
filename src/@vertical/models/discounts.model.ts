import { Moment } from 'moment';

export interface IDiscounts {
    id?: number;
    name?: string;
    description?: string;
    discountCode?: string;
    validFrom?: Moment;
    validTo?: Moment;
    supplierName?: string;
    supplierId?: number;
    discountTypeName?: string;
    discountTypeId?: number;
}

export class Discounts implements IDiscounts {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public discountCode?: string,
        public validFrom?: Moment,
        public validTo?: Moment,
        public supplierName?: string,
        public supplierId?: number,
        public discountTypeName?: string,
        public discountTypeId?: number
    ) { }
}

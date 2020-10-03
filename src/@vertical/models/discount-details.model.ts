import { Moment } from 'moment';

export interface IDiscountDetails {
    id?: number;
    name?: string;
    amount?: number;
    isPercentage?: boolean;
    isAllowCombinationDiscount?: boolean;
    isFinalBillDiscount?: boolean;
    startCount?: number;
    endCount?: number;
    multiplyCount?: number;
    minAmount?: number;
    maxAmount?: number;
    minVolumeWeight?: number;
    maxVolumeWeight?: number;
    modifiedDate?: Moment;
    discountName?: string;
    discountId?: number;
    stockItemName?: string;
    stockItemId?: number;
    productCategoryName?: string;
    productCategoryId?: number;
}

export class DiscountDetails implements IDiscountDetails {
    constructor(
        public id?: number,
        public name?: string,
        public amount?: number,
        public isPercentage?: boolean,
        public isAllowCombinationDiscount?: boolean,
        public isFinalBillDiscount?: boolean,
        public startCount?: number,
        public endCount?: number,
        public multiplyCount?: number,
        public minAmount?: number,
        public maxAmount?: number,
        public minVolumeWeight?: number,
        public maxVolumeWeight?: number,
        public modifiedDate?: Moment,
        public discountName?: string,
        public discountId?: number,
        public stockItemName?: string,
        public stockItemId?: number,
        public productCategoryName?: string,
        public productCategoryId?: number
    ) {
        this.isPercentage = this.isPercentage || false;
        this.isAllowCombinationDiscount = this.isAllowCombinationDiscount || false;
        this.isFinalBillDiscount = this.isFinalBillDiscount || false;
    }
}

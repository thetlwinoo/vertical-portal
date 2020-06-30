import { Moment } from 'moment';
import { OrderLineStatus } from './order-line-status.model';

export interface IOrderLines {
    id?: number;
    description?: string;
    quantity?: number;
    taxRate?: number;
    unitPrice?: number;
    unitPriceDiscount?: number;
    pickedQuantity?: number;
    pickingCompletedWhen?: Moment;
    status?: OrderLineStatus;
    thumbnailUrl?: string;
    lineRating?: number;
    lineReview?: any;
    customerReviewedOn?: Moment;
    supplierResponse?: any;
    supplierResponseOn?: Moment;
    likeCount?: number;
    lastEditedBy?: string;
    lastEditedWhen?: Moment;
    stockItemName?: string;
    stockItemId?: number;
    packageTypeName?: string;
    packageTypeId?: number;
    reviewImageThumbnailUrl?: string;
    reviewImageId?: number;
    supplierName?: string;
    supplierId?: number;
    orderPackageId?: number;
}

export class OrderLines implements IOrderLines {
    constructor(
        public id?: number,
        public description?: string,
        public quantity?: number,
        public taxRate?: number,
        public unitPrice?: number,
        public unitPriceDiscount?: number,
        public pickedQuantity?: number,
        public pickingCompletedWhen?: Moment,
        public status?: OrderLineStatus,
        public thumbnailUrl?: string,
        public lineRating?: number,
        public lineReview?: any,
        public customerReviewedOn?: Moment,
        public supplierResponse?: any,
        public supplierResponseOn?: Moment,
        public likeCount?: number,
        public lastEditedBy?: string,
        public lastEditedWhen?: Moment,
        public stockItemName?: string,
        public stockItemId?: number,
        public packageTypeName?: string,
        public packageTypeId?: number,
        public reviewImageThumbnailUrl?: string,
        public reviewImageId?: number,
        public supplierName?: string,
        public supplierId?: number,
        public orderPackageId?: number
    ) { }
}

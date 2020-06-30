import { Moment } from 'moment';
import { IOrderLines } from './order-lines.model';

export interface IOrderPackages {
    id?: number;
    expectedDeliveryDate?: Moment;
    comments?: string;
    deliveryInstructions?: string;
    internalComments?: string;
    customerPurchaseOrderNumber?: string;
    customerReviewedOn?: Moment;
    sellerRating?: number;
    sellerReview?: any;
    deliveryRating?: number;
    deliveryReview?: any;
    reviewAsAnonymous?: boolean;
    completedReview?: boolean;
    orderPackageDetails?: any;
    lastEditedBy?: string;
    lastEditedWhen?: Moment;
    orderLineLists?: IOrderLines[];
    supplierName?: string;
    supplierId?: number;
    orderId?: number;
}

export class OrderPackages implements IOrderPackages {
    constructor(
        public id?: number,
        public expectedDeliveryDate?: Moment,
        public comments?: string,
        public deliveryInstructions?: string,
        public internalComments?: string,
        public customerPurchaseOrderNumber?: string,
        public customerReviewedOn?: Moment,
        public sellerRating?: number,
        public sellerReview?: any,
        public deliveryRating?: number,
        public deliveryReview?: any,
        public reviewAsAnonymous?: boolean,
        public completedReview?: boolean,
        public orderPackageDetails?: any,
        public lastEditedBy?: string,
        public lastEditedWhen?: Moment,
        public orderLineLists?: IOrderLines[],
        public supplierName?: string,
        public supplierId?: number,
        public orderId?: number
    ) {
        this.reviewAsAnonymous = this.reviewAsAnonymous || false;
        this.completedReview = this.completedReview || false;
    }
}

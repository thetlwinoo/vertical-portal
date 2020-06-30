import { Moment } from 'moment';
import { IOrderPackages } from './order-packages.model';
import { PaymentStatus } from './payment-status.model';
import { OrderStatus } from './order-status.model';

export interface IOrders {
    id?: number;
    orderDate?: Moment;
    subTotal?: number;
    taxAmount?: number;
    frieight?: number;
    totalDue?: number;
    expectedDeliveryDate?: Moment;
    paymentStatus?: PaymentStatus;
    customerPurchaseOrderNumber?: string;
    comments?: string;
    deliveryInstructions?: string;
    internalComments?: string;
    pickingCompletedWhen?: Moment;
    status?: OrderStatus;
    orderDetails?: any;
    isUnderSupplyBackOrdered?: boolean;
    lastEditedBy?: string;
    lastEditedWhen?: Moment;
    orderPackageLists?: IOrderPackages[];
    customerName?: string;
    customerId?: number;
    shipToAddressId?: number;
    billToAddressId?: number;
    deliveryMethodName?: string;
    deliveryMethodId?: number;
    currencyRateId?: number;
    paymentMethodName?: string;
    paymentMethodId?: number;
    salePersonFullName?: string;
    salePersonId?: number;
    orderTrackingId?: number;
    specialDealsId?: number;
}

export class Orders implements IOrders {
    constructor(
        public id?: number,
        public orderDate?: Moment,
        public subTotal?: number,
        public taxAmount?: number,
        public frieight?: number,
        public totalDue?: number,
        public expectedDeliveryDate?: Moment,
        public paymentStatus?: PaymentStatus,
        public customerPurchaseOrderNumber?: string,
        public comments?: string,
        public deliveryInstructions?: string,
        public internalComments?: string,
        public pickingCompletedWhen?: Moment,
        public status?: OrderStatus,
        public orderDetails?: any,
        public isUnderSupplyBackOrdered?: boolean,
        public lastEditedBy?: string,
        public lastEditedWhen?: Moment,
        public orderPackageLists?: IOrderPackages[],
        public customerName?: string,
        public customerId?: number,
        public shipToAddressId?: number,
        public billToAddressId?: number,
        public deliveryMethodName?: string,
        public deliveryMethodId?: number,
        public currencyRateId?: number,
        public paymentMethodName?: string,
        public paymentMethodId?: number,
        public salePersonFullName?: string,
        public salePersonId?: number,
        public orderTrackingId?: number,
        public specialDealsId?: number
    ) {
        this.isUnderSupplyBackOrdered = this.isUnderSupplyBackOrdered || false;
    }
}

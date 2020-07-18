import { Moment } from 'moment';

export interface ICustomers {
    id?: number;
    name?: string;
    accountNumber?: string;
    accountOpenedDate?: Moment;
    standardDiscountPercentage?: number;
    isStatementSent?: boolean;
    isOnCreditHold?: boolean;
    paymentDays?: number;
    deliveryRun?: string;
    runPosition?: string;
    profilePhoto?: string;
    billToAddressSameAsDeliveryAddress?: boolean;
    lastEditedBy?: string;
    activeFlag?: boolean;
    validFrom?: Moment;
    validTo?: Moment;
    peopleFullName?: string;
    peopleId?: number;
    deliveryMethodName?: string;
    deliveryMethodId?: number;
    deliveryAddressId?: number;
    billToAddressId?: number;
}

export class Customers implements ICustomers {
    constructor(
        public id?: number,
        public name?: string,
        public accountNumber?: string,
        public accountOpenedDate?: Moment,
        public standardDiscountPercentage?: number,
        public isStatementSent?: boolean,
        public isOnCreditHold?: boolean,
        public paymentDays?: number,
        public deliveryRun?: string,
        public runPosition?: string,
        public profilePhoto?: string,
        public billToAddressSameAsDeliveryAddress?: boolean,
        public lastEditedBy?: string,
        public activeFlag?: boolean,
        public validFrom?: Moment,
        public validTo?: Moment,
        public peopleFullName?: string,
        public peopleId?: number,
        public deliveryMethodName?: string,
        public deliveryMethodId?: number,
        public deliveryAddressId?: number,
        public billToAddressId?: number
    ) {
        this.isStatementSent = this.isStatementSent || false;
        this.isOnCreditHold = this.isOnCreditHold || false;
        this.billToAddressSameAsDeliveryAddress = this.billToAddressSameAsDeliveryAddress || false;
        this.activeFlag = this.activeFlag || false;
    }
}

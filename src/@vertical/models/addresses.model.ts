import { Moment } from 'moment';

export interface IAddresses {
    id?: number;
    contactPerson?: string;
    contactNumber?: string;
    contactEmailAddress?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    description?: string;
    validFrom?: Moment;
    validTo?: Moment;
    regionName?: string;
    regionId?: number;
    cityName?: string;
    cityId?: number;
    townshipName?: string;
    townshipId?: number;
    townName?: string;
    townId?: number;
    addressTypeName?: string;
    addressTypeId?: number;
    customerAddressName?: string;
    customerAddressId?: number;
    supplierAddressName?: string;
    supplierAddressId?: number;
}

export class Addresses implements IAddresses {
    constructor(
        public id?: number,
        public contactPerson?: string,
        public contactNumber?: string,
        public contactEmailAddress?: string,
        public addressLine1?: string,
        public addressLine2?: string,
        public postalCode?: string,
        public description?: string,
        public validFrom?: Moment,
        public validTo?: Moment,
        public regionName?: string,
        public regionId?: number,
        public cityName?: string,
        public cityId?: number,
        public townshipName?: string,
        public townshipId?: number,
        public townName?: string,
        public townId?: number,
        public addressTypeName?: string,
        public addressTypeId?: number,
        public customerAddressName?: string,
        public customerAddressId?: number,
        public supplierAddressName?: string,
        public supplierAddressId?: number
    ) { }
}

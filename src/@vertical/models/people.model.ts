import { Moment } from 'moment';
import { ISuppliers } from './suppliers.model';
import { Gender } from './gender.model';

export interface IPeople {
    id?: number;
    fullName?: string;
    preferredName?: string;
    searchName?: string;
    gender?: Gender;
    dateOfBirth?: Moment;
    isPermittedToLogon?: boolean;
    logonName?: string;
    isExternalLogonProvider?: boolean;
    isSystemUser?: boolean;
    isEmployee?: boolean;
    isSalesPerson?: boolean;
    isGuestUser?: boolean;
    emailPromotion?: boolean;
    userPreferences?: string;
    phoneNumber?: string;
    emailAddress?: string;
    customFields?: string;
    otherLanguages?: string;
    userId?: string;
    profilePhoto?: string;
    validFrom?: Moment;
    validTo?: Moment;
    suppliers?: ISuppliers[];
    cartId?: number;
    wishlistId?: number;
    compareId?: number;
}

export class People implements IPeople {
    constructor(
        public id?: number,
        public fullName?: string,
        public preferredName?: string,
        public searchName?: string,
        public gender?: Gender,
        public dateOfBirth?: Moment,
        public isPermittedToLogon?: boolean,
        public logonName?: string,
        public isExternalLogonProvider?: boolean,
        public isSystemUser?: boolean,
        public isEmployee?: boolean,
        public isSalesPerson?: boolean,
        public isGuestUser?: boolean,
        public emailPromotion?: boolean,
        public userPreferences?: string,
        public phoneNumber?: string,
        public emailAddress?: string,
        public customFields?: string,
        public otherLanguages?: string,
        public userId?: string,
        public profilePhoto?: string,
        public validFrom?: Moment,
        public validTo?: Moment,
        public suppliers?: ISuppliers[],
        public cartId?: number,
        public wishlistId?: number,
        public compareId?: number
    ) {
        this.isPermittedToLogon = this.isPermittedToLogon || false;
        this.isExternalLogonProvider = this.isExternalLogonProvider || false;
        this.isSystemUser = this.isSystemUser || false;
        this.isEmployee = this.isEmployee || false;
        this.isSalesPerson = this.isSalesPerson || false;
        this.isGuestUser = this.isGuestUser || false;
        this.emailPromotion = this.emailPromotion || false;
    }
}

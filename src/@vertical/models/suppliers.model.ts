import { Moment } from 'moment';
import { IPhotos } from './photos.model';
import { IDeliveryMethods } from './delivery-methods.model';
import { IPeople } from './people.model';

export interface ISuppliers {
  id?: number;
  name?: string;
  supplierReference?: string;
  bankAccountName?: string;
  bankAccountBranch?: string;
  bankAccountCode?: string;
  bankAccountNumber?: string;
  bankInternationalCode?: string;
  paymentDays?: number;
  internalComments?: string;
  phoneNumber?: string;
  emailAddress?: string;
  nric?: string;
  companyRegistrationNo?: string;
  faxNumber?: string;
  websiteUrl?: string;
  webServiceUrl?: string;
  creditRating?: number;
  officialStoreInd?: boolean;
  storeName?: string;
  logo?: string;
  nricFrontPhoto?: string;
  nricBackPhoto?: string;
  bankBookPhoto?: string;
  companyRegistrationPhoto?: string;
  distributorCertificatePhoto?: string;
  activeFlag?: boolean;
  validFrom?: Moment;
  validTo?: Moment;
  bannerLists?: IPhotos[];
  documentLists?: IPhotos[];
  supplierCategoryName?: string;
  supplierCategoryId?: number;
  pickupAddressId?: number;
  headOfficeAddressId?: number;
  returnAddressId?: number;
  contactPersonFullName?: string;
  contactPersonId?: number;
  deliveryMethods?: IDeliveryMethods[];
  people?: IPeople[];
}

export class Suppliers implements ISuppliers {
  constructor(
    public id?: number,
    public name?: string,
    public supplierReference?: string,
    public bankAccountName?: string,
    public bankAccountBranch?: string,
    public bankAccountCode?: string,
    public bankAccountNumber?: string,
    public bankInternationalCode?: string,
    public paymentDays?: number,
    public internalComments?: string,
    public phoneNumber?: string,
    public emailAddress?: string,
    public nric?: string,
    public companyRegistrationNo?: string,
    public faxNumber?: string,
    public websiteUrl?: string,
    public webServiceUrl?: string,
    public creditRating?: number,
    public officialStoreInd?: boolean,
    public storeName?: string,
    public logo?: string,
    public nricFrontPhoto?: string,
    public nricBackPhoto?: string,
    public bankBookPhoto?: string,
    public companyRegistrationPhoto?: string,
    public distributorCertificatePhoto?: string,
    public activeFlag?: boolean,
    public validFrom?: Moment,
    public validTo?: Moment,
    public bannerLists?: IPhotos[],
    public documentLists?: IPhotos[],
    public supplierCategoryName?: string,
    public supplierCategoryId?: number,
    public pickupAddressId?: number,
    public headOfficeAddressId?: number,
    public returnAddressId?: number,
    public contactPersonFullName?: string,
    public contactPersonId?: number,
    public deliveryMethods?: IDeliveryMethods[],
    public people?: IPeople[]
  ) {
    this.officialStoreInd = this.officialStoreInd || false;
    this.activeFlag = this.activeFlag || false;
  }
}

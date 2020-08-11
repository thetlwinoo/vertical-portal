import { Moment } from 'moment';

export interface IProductDocuments {
  id?: number;
  videoUrl?: string;
  highlights?: any;
  longDescription?: any;
  shortDescription?: any;
  whatInTheBox?: any;
  careInstructions?: any;
  productType?: string;
  modelName?: string;
  modelNumber?: string;
  fabricType?: string;
  specialFeatures?: any;
  productComplianceCertificate?: string;
  genuineAndLegal?: boolean;
  countryOfOrigin?: string;
  usageAndSideEffects?: any;
  safetyWarnning?: any;
  warrantyPeriod?: string;
  warrantyPolicy?: string;
  dangerousGoods?: string;
  lastEditedBy?: string;
  lastEditedWhen?: Moment;
  warrantyTypeName?: string;
  warrantyTypeId?: number;
  productId?: number;
}

export class ProductDocuments implements IProductDocuments {
  constructor(
    public id?: number,
    public videoUrl?: string,
    public highlights?: any,
    public longDescription?: any,
    public shortDescription?: any,
    public whatInTheBox?: any,
    public careInstructions?: any,
    public productType?: string,
    public modelName?: string,
    public modelNumber?: string,
    public fabricType?: string,
    public specialFeatures?: any,
    public productComplianceCertificate?: string,
    public genuineAndLegal?: boolean,
    public countryOfOrigin?: string,
    public usageAndSideEffects?: any,
    public safetyWarnning?: any,
    public warrantyPeriod?: string,
    public warrantyPolicy?: string,
    public dangerousGoods?: string,
    public lastEditedBy?: string,
    public lastEditedWhen?: Moment,
    public warrantyTypeName?: string,
    public warrantyTypeId?: number,
    public productId?: number
  ) {
    this.genuineAndLegal = this.genuineAndLegal || false;
  }
}

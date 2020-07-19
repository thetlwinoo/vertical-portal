import { Moment } from 'moment';
import { IStockItems } from './stock-items.model';
import { RootUtils } from '@vertical/utils';
import { IProductDocument } from './product-document.model';

export interface IProducts {
  id?: number;
  name?: string;
  cultureDetails?: any;
  handle?: string;
  searchDetails?: string;
  productNumber?: string;
  sellCount?: number;
  productDetails?: any;
  totalWishlist?: number;
  overallRating?: number;
  preferredInd?: boolean;
  freeShippingInd?: boolean;
  madeInMyanmarInd?: boolean;
  questionsAboutProductInd?: boolean;
  releaseDate?: Moment;
  availableDate?: Moment;
  activeFlag?: boolean;
  lastEditedBy?: string;
  lastEditedWhen?: Moment;
  validFrom?: Moment;
  validTo?: Moment;
  productDocumentId?: number;
  stockItemLists?: IStockItems[];
  supplierName?: string;
  supplierId?: number;
  productCategoryName?: string;
  productCategoryId?: number;
  productBrandName?: string;
  productBrandId?: number;
  productDocument?: IProductDocument;
}

export class Products implements IProducts {
  constructor(
    public id?: number,
    public name?: string,
    public cultureDetails?: any,
    public handle?: string,
    public searchDetails?: string,
    public productNumber?: string,
    public sellCount?: number,
    public productDetails?: any,
    public totalWishlist?: number,
    public overallRating?: number,
    public preferredInd?: boolean,
    public freeShippingInd?: boolean,
    public madeInMyanmarInd?: boolean,
    public questionsAboutProductInd?: boolean,
    public releaseDate?: Moment,
    public availableDate?: Moment,
    public activeFlag?: boolean,
    public lastEditedBy?: string,
    public lastEditedWhen?: Moment,
    public validFrom?: Moment,
    public validTo?: Moment,
    public productDocumentId?: number,
    public stockItemLists?: IStockItems[],
    public supplierName?: string,
    public supplierId?: number,
    public productCategoryName?: string,
    public productCategoryId?: number,
    public productBrandName?: string,
    public productBrandId?: number,
    public productDocument?: IProductDocument
  ) {
    this.preferredInd = this.preferredInd || false;
    this.freeShippingInd = this.freeShippingInd || false;
    this.madeInMyanmarInd = this.madeInMyanmarInd || false;
    this.questionsAboutProductInd = this.questionsAboutProductInd || false;
    this.activeFlag = this.activeFlag || false;
    if (this.name) {
      this.handle = this.handle || RootUtils.handleize(this.name);
    }
  }
}

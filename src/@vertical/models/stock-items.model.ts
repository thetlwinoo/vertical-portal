import { Moment } from 'moment';
import { IPhotos, ISpecialDeals, IMaterials, ICurrency } from '@vertical/models';
import { RootUtils } from '@vertical/utils';
import { IProductAttribute } from './product-attribute.model';
import { IProductOption } from './product-option.model';
import { IBarcodeTypes } from './barcode-types.model';
import { IStockItemHoldings } from './stock-item-holdings.model';

export interface IStockItems {
  guid?: string;
  id?: number;
  name?: string;
  vendorCode?: string;
  vendorSKU?: string;
  generatedSKU?: string;
  barcode?: string;
  taxRate?: number;
  unitPrice?: number;
  recommendedRetailPrice?: number;
  typicalWeightPerUnit?: number;
  quantityOnHand?: number;
  shelf?: string;
  bin?: string;
  lastStockTakeQuantity?: number;
  lastCostPrice?: number;
  reorderLevel?: number;
  targetStockLevel?: number;
  leadTimeDays?: number;
  quantityPerOuter?: number;
  isChillerStock?: boolean;
  itemLength?: number;
  itemWidth?: number;
  itemHeight?: number;
  itemWeight?: number;
  itemPackageLength?: number;
  itemPackageWidth?: number;
  itemPackageHeight?: number;
  itemPackageWeight?: number;
  noOfPieces?: number;
  noOfItems?: number;
  manufacture?: string;
  marketingComments?: string;
  internalComments?: string;
  sellStartDate?: Moment;
  sellEndDate?: Moment;
  sellCount?: number;
  tags?: string;
  searchDetails?: string;
  customFields?: any;
  thumbnailUrl?: string;
  activeInd?: boolean;
  liveInd?: boolean;
  cashOnDeliveryInd?: boolean;
  lastEditedBy?: string;
  lastEditedWhen?: Moment;
  photoLists?: any[];
  specialDealLists?: ISpecialDeals[];
  itemLengthUnitCode?: string;
  itemLengthUnitId?: number;
  itemWidthUnitCode?: string;
  itemWidthUnitId?: number;
  itemHeightUnitCode?: string;
  itemHeightUnitId?: number;
  packageLengthUnitCode?: string;
  packageLengthUnitId?: number;
  packageWidthUnitCode?: string;
  packageWidthUnitId?: number;
  packageHeightUnitCode?: string;
  packageHeightUnitId?: number;
  itemPackageWeightUnitCode?: string;
  itemPackageWeightUnitId?: number;
  productAttributeValue?: string;
  productAttributeId?: number;
  productOptionValue?: string;
  productOptionId?: number;
  materialName?: string;
  materialId?: number;
  currencyCode?: string;
  currencyId?: number;
  barcodeTypeName?: string;
  barcodeTypeId?: number;
  productId?: number;
}

export class StockItems implements IStockItems {
  constructor(
    public guid?: string,
    public id?: number,
    public name?: string,
    public vendorCode?: string,
    public vendorSKU?: string,
    public generatedSKU?: string,
    public barcode?: string,
    public taxRate?: number,
    public unitPrice?: number,
    public recommendedRetailPrice?: number,
    public typicalWeightPerUnit?: number,
    public quantityOnHand?: number,
    public shelf?: string,
    public bin?: string,
    public lastStockTakeQuantity?: number,
    public lastCostPrice?: number,
    public reorderLevel?: number,
    public targetStockLevel?: number,
    public leadTimeDays?: number,
    public quantityPerOuter?: number,
    public isChillerStock?: boolean,
    public itemLength?: number,
    public itemWidth?: number,
    public itemHeight?: number,
    public itemWeight?: number,
    public itemPackageLength?: number,
    public itemPackageWidth?: number,
    public itemPackageHeight?: number,
    public itemPackageWeight?: number,
    public noOfPieces?: number,
    public noOfItems?: number,
    public manufacture?: string,
    public marketingComments?: string,
    public internalComments?: string,
    public sellStartDate?: Moment,
    public sellEndDate?: Moment,
    public sellCount?: number,
    public tags?: string,
    public searchDetails?: string,
    public customFields?: any,
    public thumbnailUrl?: string,
    public activeInd?: boolean,
    public liveInd?: boolean,
    public cashOnDeliveryInd?: boolean,
    public lastEditedBy?: string,
    public lastEditedWhen?: Moment,
    public photoLists?: any[],
    public specialDealLists?: ISpecialDeals[],
    public itemLengthUnitCode?: string,
    public itemLengthUnitId?: number,
    public itemWidthUnitCode?: string,
    public itemWidthUnitId?: number,
    public itemHeightUnitCode?: string,
    public itemHeightUnitId?: number,
    public packageLengthUnitCode?: string,
    public packageLengthUnitId?: number,
    public packageWidthUnitCode?: string,
    public packageWidthUnitId?: number,
    public packageHeightUnitCode?: string,
    public packageHeightUnitId?: number,
    public itemPackageWeightUnitCode?: string,
    public itemPackageWeightUnitId?: number,
    public productAttributeValue?: string,
    public productAttributeId?: number,
    public productOptionValue?: string,
    public productOptionId?: number,
    public materialName?: string,
    public materialId?: number,
    public currencyCode?: string,
    public currencyId?: number,
    public barcodeTypeName?: string,
    public barcodeTypeId?: number,
    public productId?: number
  ) {
    this.isChillerStock = this.isChillerStock || false;
    this.activeInd = this.activeInd || false;
    this.liveInd = this.liveInd || false;
    this.cashOnDeliveryInd = this.cashOnDeliveryInd || false;
    this.guid = RootUtils.generateGUID();
  }
}

import { Moment } from 'moment';
import { IWebImages } from './web-images.model';

export interface IProductCategory {
  id?: number;
  name?: string;
  handle?: string;
  shortLabel?: string;
  sortOrder?: number;
  iconFont?: string;
  iconPhoto?: string;
  image?: string;
  justForYouInd?: boolean;
  parentCascade?: string;
  activeFlag?: boolean;
  localization?: any;
  productExcel?: string;
  validFrom?: Moment;
  validTo?: Moment;
  webImageLists?: IWebImages[];
  parentName?: string;
  parentId?: number;
}

export class ProductCategory implements IProductCategory {
  constructor(
    public id?: number,
    public name?: string,
    public handle?: string,
    public shortLabel?: string,
    public sortOrder?: number,
    public iconFont?: string,
    public iconPhoto?: string,
    public image?: string,
    public justForYouInd?: boolean,
    public parentCascade?: string,
    public activeFlag?: boolean,
    public localization?: any,
    public productExcel?: string,
    public validFrom?: Moment,
    public validTo?: Moment,
    public webImageLists?: IWebImages[],
    public parentName?: string,
    public parentId?: number
  ) {
    this.justForYouInd = this.justForYouInd || false;
    this.activeFlag = this.activeFlag || false;
  }
}

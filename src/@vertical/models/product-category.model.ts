import { Moment } from 'moment';

export interface IProductCategory {
  id?: number;
  name?: string;
  handle?: string;
  shortLabel?: string;
  sortOrder?: number;
  iconFont?: string;
  iconPhoto?: string;
  justForYouInd?: boolean;
  parentCascade?: string;
  activeFlag?: boolean;
  localization?: any;
  validFrom?: Moment;
  validTo?: Moment;
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
    public justForYouInd?: boolean,
    public parentCascade?: string,
    public activeFlag?: boolean,
    public localization?: any,
    public validFrom?: Moment,
    public validTo?: Moment,
    public parentName?: string,
    public parentId?: number
  ) {
    this.justForYouInd = this.justForYouInd || false;
    this.activeFlag = this.activeFlag || false;
  }
}

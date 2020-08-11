import { Moment } from 'moment';

export interface IProductBrand {
  id?: number;
  name?: string;
  handle?: string;
  shortLabel?: string;
  sortOrder?: number;
  iconFont?: string;
  iconPhoto?: string;
  activeFlag?: boolean;
  localization?: any;
  validFrom?: Moment;
  validTo?: Moment;
  myanmarName?: string;
}

export class ProductBrand implements IProductBrand {
  constructor(
    public id?: number,
    public name?: string,
    public handle?: string,
    public shortLabel?: string,
    public sortOrder?: number,
    public iconFont?: string,
    public iconPhoto?: string,
    public activeFlag?: boolean,
    public localization?: any,
    public validFrom?: Moment,
    public validTo?: Moment,
    public myanmarName?: string
  ) {
    this.activeFlag = this.activeFlag || false;
  }
}

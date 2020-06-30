export interface IProductCategory {
  id?: number;
  name?: string;
  shortLabel?: string;
  sortOrder?: number;
  iconFont?: string;
  justForYouInd?: boolean;
  showInNavInd?: boolean;
  parentName?: string;
  parentId?: number;
  iconThumbnailUrl?: string;
  iconId?: number;
  key?: number;
  title?: string;
  expanded?: boolean;
  original?: IProductCategory;
  children?: IProductCategory[];
}

export class ProductCategory implements IProductCategory {
  constructor(
    public id?: number,
    public name?: string,
    public shortLabel?: string,
    public sortOrder?: number,
    public iconFont?: string,
    public justForYouInd?: boolean,
    public showInNavInd?: boolean,
    public parentName?: string,
    public parentId?: number,
    public iconThumbnailUrl?: string,
    public iconId?: number,
    public key?: number,
    public title?: string,
    public expanded?: boolean,
    public original?: IProductCategory,
    public children?: IProductCategory[]
  ) { }
}

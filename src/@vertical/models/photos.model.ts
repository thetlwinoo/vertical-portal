import { Moment } from 'moment';

export interface IPhotos {
  id?: number;
  blobId?: string;
  priority?: number;
  uid?: string;
  size?: number;
  name?: string;
  fileName?: string;
  url?: string;
  status?: string;
  thumbUrl?: string;
  percent?: number;
  type?: string;
  defaultInd?: boolean;
  activeFlag?: boolean;
  lastModified?: string;
  lastModifiedDate?: Moment;
  stockItemId?: number;
  supplierBannerId?: number;
  supplierDocumentId?: number;
}

export class Photos implements IPhotos {
  constructor(
    public id?: number,
    public blobId?: string,
    public priority?: number,
    public uid?: string,
    public size?: number,
    public name?: string,
    public fileName?: string,
    public url?: string,
    public status?: string,
    public thumbUrl?: string,
    public percent?: number,
    public type?: string,
    public defaultInd?: boolean,
    public activeFlag?: boolean,
    public lastModified?: string,
    public lastModifiedDate?: Moment,
    public stockItemId?: number,
    public supplierBannerId?: number,
    public supplierDocumentId?: number
  ) {
    this.defaultInd = this.defaultInd || false;
    this.activeFlag = this.activeFlag || false;
  }
}

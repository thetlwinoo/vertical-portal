import { Moment } from 'moment';

export interface IWebImages {
    id?: number;
    title?: string;
    subTitle?: string;
    url?: string;
    priority?: number;
    activeFlag?: boolean;
    promoStartDate?: Moment;
    promoEndDate?: Moment;
    webImageTypeName?: string;
    webImageTypeId?: number;
    webSitemapId?: number;
    supplierId?: number;
    productCategoryId?: number;
    productBrandId?: number;
}

export class WebImages implements IWebImages {
    constructor(
        public id?: number,
        public title?: string,
        public subTitle?: string,
        public url?: string,
        public priority?: number,
        public activeFlag?: boolean,
        public promoStartDate?: Moment,
        public promoEndDate?: Moment,
        public webImageTypeName?: string,
        public webImageTypeId?: number,
        public webSitemapId?: number,
        public supplierId?: number,
        public productCategoryId?: number,
        public productBrandId?: number
    ) {
        this.activeFlag = this.activeFlag || false;
    }
}

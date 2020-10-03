import { Moment } from 'moment';
import { IWebImages } from './web-images.model';

export interface IWebSitemap {
    id?: number;
    name?: string;
    shortLabel?: string;
    handle?: string;
    title?: string;
    subTitle?: string;
    parentId?: string;
    url?: string;
    exactMatch?: boolean;
    extraQuery?: string;
    iconFont?: string;
    iconPhoto?: string;
    priority?: number;
    activeFlag?: boolean;
    content?: any;
    validFrom?: Moment;
    validTo?: Moment;
    webImageLists?: IWebImages[];
}

export class WebSitemap implements IWebSitemap {
    constructor(
        public id?: number,
        public name?: string,
        public shortLabel?: string,
        public handle?: string,
        public title?: string,
        public subTitle?: string,
        public parentId?: string,
        public url?: string,
        public exactMatch?: boolean,
        public extraQuery?: string,
        public iconFont?: string,
        public iconPhoto?: string,
        public priority?: number,
        public activeFlag?: boolean,
        public content?: any,
        public validFrom?: Moment,
        public validTo?: Moment,
        public webImageLists?: IWebImages[]
    ) {
        this.exactMatch = this.exactMatch || false;
        this.activeFlag = this.activeFlag || false;
    }
}

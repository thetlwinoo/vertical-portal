import { Moment } from 'moment';

export interface IRegions {
    id?: number;
    code?: string;
    name?: string;
    cultureDetails?: any;
    validFrom?: Moment;
    validTo?: Moment;
    cityName?: string;
    cityId?: number;
    districtName?: string;
    districtId?: number;
}

export class Regions implements IRegions {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public cultureDetails?: any,
        public validFrom?: Moment,
        public validTo?: Moment,
        public cityName?: string,
        public cityId?: number,
        public districtName?: string,
        public districtId?: number
    ) { }
}

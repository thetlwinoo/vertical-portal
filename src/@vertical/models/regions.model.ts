import { Moment } from 'moment';

export interface IRegions {
    id?: number;
    name?: string;
    description?: string;
    localization?: any;
    validFrom?: Moment;
    validTo?: Moment;
    stateProvinceName?: string;
    stateProvinceId?: number;
}

export class Regions implements IRegions {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public localization?: any,
        public validFrom?: Moment,
        public validTo?: Moment,
        public stateProvinceName?: string,
        public stateProvinceId?: number
    ) { }
}

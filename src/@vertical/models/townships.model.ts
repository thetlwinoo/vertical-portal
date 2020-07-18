import { Moment } from 'moment';

export interface ITownships {
    id?: number;
    name?: string;
    cultureDetails?: any;
    description?: string;
    validFrom?: Moment;
    validTo?: Moment;
    cityName?: string;
    cityId?: number;
}

export class Townships implements ITownships {
    constructor(
        public id?: number,
        public name?: string,
        public cultureDetails?: any,
        public description?: string,
        public validFrom?: Moment,
        public validTo?: Moment,
        public cityName?: string,
        public cityId?: number
    ) { }
}

import { Moment } from 'moment';

export interface ITowns {
    id?: number;
    name?: string;
    postalCode?: string;
    cultureDetails?: any;
    description?: string;
    validFrom?: Moment;
    validTo?: Moment;
    townshipName?: string;
    townshipId?: number;
}

export class Towns implements ITowns {
    constructor(
        public id?: number,
        public name?: string,
        public postalCode?: string,
        public cultureDetails?: any,
        public description?: string,
        public validFrom?: Moment,
        public validTo?: Moment,
        public townshipName?: string,
        public townshipId?: number
    ) { }
}

import { Moment } from 'moment';

export interface IDiscountTypes {
    id?: number;
    name?: string;
    shortLabel?: string;
    handle?: string;
    modifiedDate?: Moment;
}

export class DiscountTypes implements IDiscountTypes {
    constructor(public id?: number, public name?: string, public shortLabel?: string, public handle?: string, public modifiedDate?: Moment) { }
}

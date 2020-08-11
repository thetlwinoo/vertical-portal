import { RootUtils } from '@vertical/utils';

export interface ISpecialFeatures {
    id?: string;
    name?: string;
    value?: string;
}

export class SpecialFeatures implements ISpecialFeatures {
    constructor(public id?: string, public name?: string, public value?: string) {
        this.id = RootUtils.generateGUID();
    }
}

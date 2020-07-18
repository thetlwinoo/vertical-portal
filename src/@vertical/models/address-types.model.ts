import { AddressTypeRefer } from './address-type-refer.model';

export interface IAddressTypes {
    id?: number;
    name?: string;
    refer?: AddressTypeRefer;
}

export class AddressTypes implements IAddressTypes {
    constructor(public id?: number, public name?: string, public refer?: AddressTypeRefer) { }
}

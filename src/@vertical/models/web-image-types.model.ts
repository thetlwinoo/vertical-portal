export interface IWebImageTypes {
    id?: number;
    name?: string;
    handle?: string;
    width?: number;
    height?: number;
}

export class WebImageTypes implements IWebImageTypes {
    constructor(public id?: number, public name?: string, public handle?: string, public width?: number, public height?: number) { }
}

export interface IRegionsLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    regionName?: string;
    regionId?: number;
}

export class RegionsLocalize implements IRegionsLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public regionName?: string,
        public regionId?: number
    ) { }
}

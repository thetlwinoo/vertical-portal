export interface IStateProvincesLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    stateProvinceName?: string;
    stateProvinceId?: number;
}

export class StateProvincesLocalize implements IStateProvincesLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public stateProvinceName?: string,
        public stateProvinceId?: number
    ) { }
}

export interface ICountriesLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    countryName?: string;
    countryId?: number;
}

export class CountriesLocalize implements ICountriesLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public countryName?: string,
        public countryId?: number
    ) { }
}

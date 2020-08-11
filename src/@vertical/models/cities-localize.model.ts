export interface ICitiesLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    cityName?: string;
    cityId?: number;
}

export class CitiesLocalize implements ICitiesLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public cityName?: string,
        public cityId?: number
    ) { }
}

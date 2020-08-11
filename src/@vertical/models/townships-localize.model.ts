export interface ITownshipsLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    townshipName?: string;
    townshipId?: number;
}

export class TownshipsLocalize implements ITownshipsLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public townshipName?: string,
        public townshipId?: number
    ) { }
}

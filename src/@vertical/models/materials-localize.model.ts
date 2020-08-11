export interface IMaterialsLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    materialName?: string;
    materialId?: number;
}

export class MaterialsLocalize implements IMaterialsLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public materialName?: string,
        public materialId?: number
    ) { }
}

export interface IStockItemsLocalize {
    id?: number;
    name?: string;
    cultureCode?: string;
    cultureId?: number;
    stockItemName?: string;
    stockItemId?: number;
}

export class StockItemsLocalize implements IStockItemsLocalize {
    constructor(
        public id?: number,
        public name?: string,
        public cultureCode?: string,
        public cultureId?: number,
        public stockItemName?: string,
        public stockItemId?: number
    ) { }
}

import { Moment } from 'moment';

export interface IStockItemHoldings {
    id?: number;
    quantityOnHand?: number;
    binLocation?: string;
    lastStockTakeQuantity?: number;
    lastCostPrice?: number;
    reorderLevel?: number;
    targerStockLevel?: number;
    lastEditedBy?: string;
    lastEditedWhen?: Moment;
    stockItemId?: number;
}

export class StockItemHoldings implements IStockItemHoldings {
    constructor(
        public id?: number,
        public quantityOnHand?: number,
        public binLocation?: string,
        public lastStockTakeQuantity?: number,
        public lastCostPrice?: number,
        public reorderLevel?: number,
        public targerStockLevel?: number,
        public lastEditedBy?: string,
        public lastEditedWhen?: Moment,
        public stockItemId?: number
    ) { }
}

import { Pipe, PipeTransform } from '@angular/core';
import { IStockItems } from '@vertical/models';

@Pipe({
  name: 'stockItemsFilter',
})
export class StockItemsFilterPipe implements PipeTransform {
  transform(items: IStockItems[], type: number): any {
    switch (type) {
      case 0:
        return items;
        break;
      case 1:
        return items.filter(i => i.activeFlag === true);
        break;
      case 4:
        return items.filter(i => i.activeFlag === false);
        break;
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { IStockItems } from '@vertical/models';

@Pipe({
  name: 'imageMissing',
})
export class ImagesMissingFilterPipe implements PipeTransform {
  transform(items: IStockItems[], missingInd: boolean): any {
    if (!missingInd) {
      return items;
    }
    return items.filter(item => (item.photoLists.length > 0 ? false : true));
  }
}

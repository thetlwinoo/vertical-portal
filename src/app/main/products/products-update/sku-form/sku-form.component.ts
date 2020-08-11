import { Component, OnInit, ViewEncapsulation, Input, OnDestroy, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { vsAnimations } from '@vertical/animations';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {
  IProductCategory,
  IProductChoice,
  IProductAttribute,
  IProductOption,
  IBarcodeTypes,
  StockItems,
  IProducts,
  Products,
} from '@vertical/models';

import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as fromProducts from 'app/ngrx/products/reducers';
import { FetchActions, CategoryActions } from 'app/ngrx/products/actions';
// import { ProductSku } from './product-sku.model';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { ImageUtils } from '@vertical/services';

@Component({
  selector: 'sku-form',
  templateUrl: './sku-form.component.html',
  styleUrls: ['./sku-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: vsAnimations,
})
export class SkuFormComponent implements OnInit, OnDestroy {
  @Input() productsForm: FormGroup;
  @Input() productAttributeList: IProductAttribute[];
  @Input() productOptionList: IProductOption[];
  // @Output() addStockItem = new EventEmitter<{}>();

  category$: Observable<IProductCategory>;
  productChoice$: Observable<IProductChoice[]>;
  productAttributeList$: Observable<IProductAttribute[]>;
  productOptionList$: Observable<IProductOption[]>;
  barcodeTypes$: Observable<IBarcodeTypes[]>;
  productChoice: IProductChoice;
  productOptionId: number;
  productAttribueId: number;
  attributeList: IProductAttribute[];
  optionList: IProductOption[];
  stockItemsColumns: any[];
  frozenCols: any[];
  noChoiceInd = false;
  attributeInd = false;
  optionInd = false;
  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private store: Store<fromProducts.State>,
    private formBuilder: FormBuilder,
    protected dataUtils: JhiDataUtils,
    protected elementRef: ElementRef,
    private imageUtils: ImageUtils
  ) {
    this.productChoice$ = store.pipe(select(fromProducts.getFetchProductChoice));
    this.productAttributeList$ = store.pipe(select(fromProducts.getFetchProductAttributeList));
    this.productOptionList$ = store.pipe(select(fromProducts.getFetchProductOptionList));
    this.barcodeTypes$ = this.store.pipe(select(fromProducts.getFetchBarcodeTypes));
  }

  get stockItemListsForm(): FormArray {
    if (this.productsForm) {
      return this.productsForm.get('stockItemLists') as FormArray;
    }
  }

  ngOnInit(): void {
    this.stockItemsColumns = [
      { field: 'guid', header: 'guid' },
      { field: 'productAttribute', header: 'Attribute' },
      { field: 'productOption', header: 'Option' },
      { field: 'sellerSKU', header: 'SellerSKU' },
      { field: 'quantityPerOuter', header: 'Quantity' },
      { field: 'recommendedRetailPrice', header: 'RetailPrice' },
      { field: 'unitPrice', header: 'UnitPrice' },
      { field: 'typicalWeightPerUnit', header: 'Weight(kg)' },
      { field: 'typicalLengthPerUnit', header: 'Length(cm)' },
      { field: 'typicalWidthPerUnit', header: 'Width(cm)' },
      { field: 'typicalHeightPerUnit', header: 'Height(cm)' },
    ];

    this.productChoice$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log('product choice', data);
      this.productChoice = data.length ? data[0] : null;
      if (this.productChoice) {
        const attributeSetName = this.productChoice.productAttributeSetName;
        const optionSetName = this.productChoice.productOptionSetValue;
        if (attributeSetName === 'NoAttributeSet' && optionSetName === 'NoOptionSet') {
          this.noChoiceInd = true;
          this.attributeInd = false;
          this.optionInd = false;
        } else {
          this.noChoiceInd = false;
          this.attributeInd = attributeSetName !== 'NoAttributeSet' ? true : false;
          this.optionInd = optionSetName !== 'NoOptionSet' ? true : false;
        }
      }
    });

    this.store.dispatch(FetchActions.fetchCategories());
    this.store.dispatch(FetchActions.fetchBarcodeType());
  }

  byteSize(field): string {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field): void {
    this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, entity, field, isImage): Promise<[any, any]> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.imageUtils.handleFiles(event, entity, 'thumbnailPhotoBlob', isImage),
        this.dataUtils.setFileData(event, entity, field, isImage),
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  clearInputImage(entity): Promise<[void, void]> {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.dataUtils.clearInputImage(entity, this.elementRef, 'thumbnailPhotoBlob', 'thumbnailPhotoBlobContentType', 'fileImage'),
        this.dataUtils.clearInputImage(entity, this.elementRef, 'originalPhotoBlob', 'originalPhotoBlobContentType', 'fileImage'),
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  addStockItem(): void {
    const stockItemLists = this.productsForm.get('stockItemLists') as FormArray;
    stockItemLists.push(this.formBuilder.group(new StockItems()));
    console.log(stockItemLists);
  }

  removeStockItem(item, index): void {
    const stockItemLists = this.productsForm.get('stockItemLists') as FormArray;
    if (index >= 0) {
      stockItemLists.removeAt(index);
    }
  }

  compareObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

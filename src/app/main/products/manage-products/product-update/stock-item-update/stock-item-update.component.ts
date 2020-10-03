import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormGroup } from '@angular/forms';
import {
  IProductChoice,
  IProductAttribute,
  IProductOption,
  IUnitMeasure,
  IMaterials,
  ICurrency,
  IBarcodeTypes,
  ISuppliers,
  IProducts
} from '@vertical/models';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromProducts from 'app/ngrx/products/reducers';
import { takeUntil } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { UnitMeasureService, BarcodeTypesService, MaterialsService, CurrencyService } from '@vertical/services';
import { FetchActions } from 'app/ngrx/products/actions';

type SelectableEntity = ISuppliers | IUnitMeasure | IProductAttribute | IProductOption | IMaterials | ICurrency | IBarcodeTypes | IProducts;

@Component({
  selector: 'app-stock-item-update',
  templateUrl: './stock-item-update.component.html',
  styleUrls: ['./stock-item-update.component.scss']
})
export class StockItemUpdateComponent implements OnInit, OnChanges {
  @Input() stockItemForm?: FormGroup;
  @Input() productCategoryId?: number;
  @Input() supplier?: ISuppliers;

  productChoice$: Observable<IProductChoice[]>;
  productAttributeList$: Observable<IProductAttribute[]>;
  productOptionList$: Observable<IProductOption[]>;
  productChoice: IProductChoice[];
  productOptionId: number;
  productAttribueId: number;
  attributeList: IProductAttribute[];
  optionList: IProductOption[];
  attributeSetName: string;
  optionSetName: string;
  noChoiceInd = false;
  attributeInd = false;
  optionInd = false;
  unitmeasures: IUnitMeasure[] = [];
  // materials: IMaterials[] = [];
  currencies: ICurrency[] = [];
  barcodetypes: IBarcodeTypes[] = [];

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private modal: NzModalRef,
    private store: Store<fromProducts.State>,
    protected unitMeasureService: UnitMeasureService,
    // protected materialsService: MaterialsService,
    protected currencyService: CurrencyService,
    protected barcodeTypesService: BarcodeTypesService,
  ) {
    this.productChoice$ = store.pipe(select(fromProducts.getFetchProductChoice));
    this.productAttributeList$ = store.pipe(select(fromProducts.getFetchProductAttributeList));
    this.productOptionList$ = store.pipe(select(fromProducts.getFetchProductOptionList));
  }

  ngOnInit(): void {
    this.productChoice$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log('product choice', res);
      this.productChoice = res;
      this.stockItemForm.patchValue({ productAttributeSetId: res[0].productAttributeSetId, productOptionSetId: res[0].productOptionSetId });
      // this.productChoice = data.length ? data[0] : null;
      // if (this.productChoice) {
      //   this.attributeSetName = this.productChoice.productAttributeSetName;
      //   this.optionSetName = this.productChoice.productOptionSetValue;
      //   if (this.attributeSetName === 'NoAttributeSet' && this.optionSetName === 'NoOptionSet') {
      //     this.noChoiceInd = true;
      //     this.attributeInd = false;
      //     this.optionInd = false;
      //   } else {
      //     this.noChoiceInd = false;
      //     this.attributeInd = this.attributeSetName !== 'NoAttributeSet' ? true : false;
      //     this.optionInd = this.optionSetName !== 'NoOptionSet' ? true : false;
      //   }
      // }
    });

    this.unitMeasureService.query().subscribe((res: HttpResponse<IUnitMeasure[]>) => (this.unitmeasures = res.body || []));

    // this.materialsService.query().subscribe((res: HttpResponse<IMaterials[]>) => (this.materials = res.body || []));

    this.currencyService.query().subscribe((res: HttpResponse<ICurrency[]>) => (this.currencies = res.body || []));

    this.barcodeTypesService.query().subscribe((res: HttpResponse<IBarcodeTypes[]>) => (this.barcodetypes = res.body || []));
  }

  ngOnChanges(): void {
    if (this.productCategoryId) {

    }
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.stockItemForm });
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  onChangedAttributeSet(event): void {
    this.store.dispatch(FetchActions.fetchProductAttribute({ prop: { productAttributeSetId: event, supplierId: this.supplier.id } }));
  }

  onChangedOptionSet(event): void {
    this.store.dispatch(FetchActions.fetchProductOption({ prop: { productOptionSetId: event, supplierId: this.supplier.id } }));
  }
}

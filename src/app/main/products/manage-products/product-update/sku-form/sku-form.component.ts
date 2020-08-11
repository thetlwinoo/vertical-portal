/* tslint:disable */
import { Component, OnInit, Input, OnChanges, ViewEncapsulation, ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { StockItemUpdateComponent } from '../stock-item-update/stock-item-update.component';
import * as moment from 'moment';
import { StockItemsService } from '@vertical/services';
import { JhiEventManager } from 'ng-jhipster';
import { IStockItems, ISuppliers } from '@vertical/models';
import { DATE_TIME_FORMAT } from '@vertical/constants';

@Component({
  selector: 'app-sku-form',
  templateUrl: './sku-form.component.html',
  styleUrls: ['./sku-form.component.scss'],
})
export class SkuFormComponent implements OnInit, OnChanges {
  @Input() editForm: FormGroup;
  @Input() supplier: ISuppliers;

  expandSet = new Set<number>();
  confirmModal?: NzModalRef;

  get stockItemListsForm(): FormArray {
    if (this.editForm) {
      return this.editForm.get('stockItemLists') as FormArray;
    }
  }

  get productCategoryId(): number {
    if (this.editForm) {
      return this.editForm.get('productCategoryId').value;
    }
  }

  get id(): number {
    if (this.editForm) {
      return this.editForm.get('id').value;
    }
  }

  stockItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private cdk: ChangeDetectorRef,
    protected stockItemsService: StockItemsService,
    protected eventManager: JhiEventManager
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.editForm) {
      console.log('form changes', this.stockItemListsForm);
    }
  }

  createStockItem(): void {
    this.stockItemForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      handle: [],
      vendorCode: [],
      vendorSKU: [],
      generatedSKU: [],
      barcode: [],
      taxRate: [],
      unitPrice: [null, [Validators.required]],
      recommendedRetailPrice: [],
      typicalWeightPerUnit: [],
      quantityOnHand: [null, [Validators.required]],
      shelf: [],
      bin: [],
      lastStockTakeQuantity: [],
      lastCostPrice: [null, [Validators.required]],
      reorderLevel: [],
      targetStockLevel: [],
      leadTimeDays: [],
      quantityPerOuter: [],
      isChillerStock: [false, [Validators.required]],
      itemLength: [],
      itemWidth: [],
      itemHeight: [],
      itemWeight: [],
      itemPackageLength: [],
      itemPackageWidth: [],
      itemPackageHeight: [],
      itemPackageWeight: [],
      noOfPieces: [],
      noOfItems: [],
      manufacture: [],
      marketingComments: [],
      internalComments: [],
      sellStartDate: [],
      sellEndDate: [],
      sellCount: [],
      tags: [],
      searchDetails: [],
      customFields: [],
      thumbnailPhoto: [],
      liveInd: [false, [Validators.required]],
      cashOnDeliveryInd: [false, [Validators.required]],
      lastEditedBy: ['SYSTEM', [Validators.required]],
      lastEditedWhen: [moment(Date.now(), DATE_TIME_FORMAT), [Validators.required]],
      activeFlag: [true, [Validators.required]],
      localization: [],
      validFrom: [moment(Date.now(), DATE_TIME_FORMAT), [Validators.required]],
      validTo: [],
      supplierId: [],
      itemLengthUnitId: [],
      itemWidthUnitId: [],
      itemHeightUnitId: [],
      packageLengthUnitId: [],
      packageWidthUnitId: [],
      packageHeightUnitId: [],
      itemPackageWeightUnitId: [],
      productAttributeId: [],
      productOptionId: [],
      materialId: [],
      currencyId: [],
      barcodeTypeId: [],
      productId: [],
      productAttributeSetId: [],
      productOptionSetId: []
    });
  }

  createStockItemModal(): void {
    this.createStockItem();

    const modal = this.modal.create({
      nzTitle: 'Add Stock Item',
      nzWidth: 1080,
      nzContent: StockItemUpdateComponent,
      nzViewContainerRef: this.viewContainerRef,
      // nzGetContainer: () => document.body,
      nzComponentParams: {
        stockItemForm: this.stockItemForm,
        productCategoryId: this.productCategoryId,
        supplier: this.supplier
      },
      nzClosable: false,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Save',
          type: 'primary',
          disabled: componentInstance => {
            return componentInstance!.stockItemForm.invalid;
          },
          onClick: componentInstance => {
            // this.saveStockItem(componentInstance!.stockItemForm);
            const stockItemLists = this.editForm.get('stockItemLists') as FormArray;
            stockItemLists.push(componentInstance!.stockItemForm);
            componentInstance!.destroyModal();
          }
        },
        {
          label: 'Cancel',
          onClick: componentInstance => {
            componentInstance!.destroyModal();
          }
        }
      ]
    });
  }

  updateStockItemModal(event?: FormGroup): void {
    const modal = this.modal.create({
      nzTitle: 'Update Stock Item',
      nzWidth: 1080,
      nzContent: StockItemUpdateComponent,
      nzViewContainerRef: this.viewContainerRef,
      // nzGetContainer: () => document.body,
      nzComponentParams: {
        stockItemForm: event,
        productCategoryId: this.productCategoryId,
        supplier: this.supplier
      },
      nzClosable: false,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Save',
          type: 'primary',
          disabled: componentInstance => {
            return componentInstance!.stockItemForm.invalid;
          },
          onClick: componentInstance => {
            componentInstance!.destroyModal();
          }
        },
        {
          label: 'Cancel',
          onClick: componentInstance => {
            componentInstance!.destroyModal();
          }
        }
      ]
    });

    // const instance = modal.getContentComponent();
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // modal.afterClose.subscribe(result => {
    //   console.log('[afterClose] The result is:', result);
    // });
  }

  // saveStockItem(saveForm: FormGroup): void {
  //   const saveData: IStockItems = saveForm.getRawValue();

  //   if (saveData.id) {
  //     this.stockItemsService.update(saveData).subscribe(res => {
  //       this.eventManager.broadcast('stockItemListModification');
  //     });
  //   } else {
  //     saveData.productId = this.id;
  //     this.stockItemsService.create(saveData).subscribe(res => {
  //       console.log('add new', res.body)
  //       this.eventManager.broadcast('stockItemListModification');
  //     });
  //   }
  // }

  deleteConfirm(data: IStockItems, index): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this stock item?',
      nzContent: 'When clicked the OK button, stock item will be deleted from the system',
      nzOnOk: () => {
        // if (data.id) {
        //   this.stockItemsService.delete(data.id).subscribe(() => {
        //     this.eventManager.broadcast('stockItemListModification');
        //   });
        // }
        console.log('index', index)
        const stockItemLists = this.editForm.get('stockItemLists') as FormArray;
        if (index >= 0) {
          stockItemLists.removeAt(index);
        }
      }
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
}

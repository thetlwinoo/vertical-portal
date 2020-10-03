/* tslint:disable */
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { DiscountDetailsService, StockItemsService, ProductCategoryService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IDiscountDetails, DiscountDetails, ISuppliers, IStockItems, IProductCategory, IDiscounts } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RootUtils } from '@vertical/utils';
import { Store, select } from '@ngrx/store';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { NzModalRef } from 'ng-zorro-antd/modal';

type SelectableEntity = IDiscounts | IStockItems | IProductCategory;

@Component({
  selector: 'discount-details-view-edit',
  templateUrl: './discount-details-view-edit.component.html',
  styleUrls: ['./discount-details-view-edit.component.scss']
})
export class DiscountDetailsViewEditComponent implements OnInit, OnDestroy {
  @Input() discountId: number;
  @Input() discountDetails: IDiscountDetails;

  isSaving = false;
  loading = false;
  stockitems: IStockItems[] = [];
  productCategories: IProductCategory[] = [];
  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    amount: [null, [Validators.required]],
    isPercentage: [false, [Validators.required]],
    isAllowCombinationDiscount: [false, [Validators.required]],
    isFinalBillDiscount: [false, [Validators.required]],
    startCount: [],
    endCount: [],
    multiplyCount: [],
    minAmount: [],
    maxAmount: [],
    minVolumeWeight: [],
    maxVolumeWeight: [],
    modifiedDate: [moment().startOf('day'), [Validators.required]],
    discountId: [],
    stockItemId: [],
    productCategoryId: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected discountDetailsService: DiscountDetailsService,
    protected stockItemsService: StockItemsService,
    protected productCategoryService: ProductCategoryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private authStore: Store<fromAuth.State>,
    private modal: NzModalRef,
    protected eventManager: JhiEventManager,
  ) {
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    if (this.discountId) {
      this.editForm.patchValue({ 'discountId': this.discountId });
    }

    if (this.discountDetails) {
      if (!this.discountDetails.id) {
        const today = moment().startOf('day');
        this.discountDetails.modifiedDate = today;
      }
      this.updateForm(this.discountDetails);
    }

    this.selectedSupplier$.subscribe(res => {
      this.selectedSupplier = res;
      if (this.selectedSupplier) {
        this.stockItemsService.query({
          'supplierId.equals': res.id
        }).subscribe((res: HttpResponse<IStockItems[]>) => (this.stockitems = res.body || []));

        this.productCategoryService.getSupplierCategories(res.id).subscribe((res: HttpResponse<IProductCategory[]>) => (this.productCategories = res.body || []));
      }
    });
  }

  updateForm(discountDetails: IDiscountDetails): void {
    this.editForm.patchValue({
      id: discountDetails.id,
      name: discountDetails.name,
      amount: discountDetails.amount,
      isPercentage: discountDetails.isPercentage,
      isAllowCombinationDiscount: discountDetails.isAllowCombinationDiscount,
      isFinalBillDiscount: discountDetails.isFinalBillDiscount,
      startCount: discountDetails.startCount,
      endCount: discountDetails.endCount,
      multiplyCount: discountDetails.multiplyCount,
      minAmount: discountDetails.minAmount,
      maxAmount: discountDetails.maxAmount,
      minVolumeWeight: discountDetails.minVolumeWeight,
      maxVolumeWeight: discountDetails.maxVolumeWeight,
      modifiedDate: discountDetails.modifiedDate ? discountDetails.modifiedDate.format(DATE_TIME_FORMAT) : null,
      discountId: discountDetails.discountId,
      stockItemId: discountDetails.stockItemId,
      productCategoryId: discountDetails.productCategoryId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discountDetails = this.createFromForm();

    if (discountDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.discountDetailsService.update(discountDetails));
    } else {
      this.subscribeToSaveResponse(this.discountDetailsService.create(discountDetails));
    }
  }

  private createFromForm(): IDiscountDetails {
    return {
      ...new DiscountDetails(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      isPercentage: this.editForm.get(['isPercentage'])!.value,
      isAllowCombinationDiscount: this.editForm.get(['isAllowCombinationDiscount'])!.value,
      isFinalBillDiscount: this.editForm.get(['isFinalBillDiscount'])!.value,
      startCount: this.editForm.get(['startCount'])!.value,
      endCount: this.editForm.get(['endCount'])!.value,
      multiplyCount: this.editForm.get(['multiplyCount'])!.value,
      minAmount: this.editForm.get(['minAmount'])!.value,
      maxAmount: this.editForm.get(['maxAmount'])!.value,
      minVolumeWeight: this.editForm.get(['minVolumeWeight'])!.value,
      maxVolumeWeight: this.editForm.get(['maxVolumeWeight'])!.value,
      modifiedDate: this.editForm.get(['modifiedDate'])!.value
        ? moment(this.editForm.get(['modifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      discountId: this.editForm.get(['discountId'])!.value,
      stockItemId: this.editForm.get(['stockItemId'])!.value,
      productCategoryId: this.editForm.get(['productCategoryId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscountDetails>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.eventManager.broadcast('discountDetailsModification');
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  beforeUpload = (file: File) =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ iconPhoto: info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  onChangeName(event) {
    this.editForm.patchValue({ handle: RootUtils.handleize(event) });
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.editForm.getRawValue() });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

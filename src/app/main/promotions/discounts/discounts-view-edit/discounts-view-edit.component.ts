/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { DiscountsService, SuppliersService, DiscountTypesService, DiscountDetailsService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IDiscounts, Discounts, ISuppliers, IDiscountTypes, IDiscountDetails } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RootUtils } from '@vertical/utils';
import { Store, select } from '@ngrx/store';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

type SelectableEntity = ISuppliers | IDiscountTypes;

@Component({
  selector: 'app-discounts-view-edit',
  templateUrl: './discounts-view-edit.component.html',
  styleUrls: ['./discounts-view-edit.component.scss']
})
export class DiscountsViewEditComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;
  suppliers: ISuppliers[] = [];
  discounts: IDiscounts;
  discounttypes: IDiscountTypes[] = [];
  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    discountCode: [],
    validFrom: [null, [Validators.required]],
    validTo: [],
    supplierId: [],
    discountTypeId: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected discountsService: DiscountsService,
    protected suppliersService: SuppliersService,
    protected discountTypesService: DiscountTypesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private authStore: Store<fromAuth.State>,
  ) {
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discounts }) => {
      this.discounts = discounts;

      if (!discounts.id) {
        const today = moment().startOf('day');
        discounts.validFrom = today;
        discounts.validTo = today;
      }
      this.updateForm(discounts);
    });

    this.suppliersService.query().subscribe((res: HttpResponse<ISuppliers[]>) => (this.suppliers = res.body || []));

    this.discountTypesService.query().subscribe((res: HttpResponse<IDiscountTypes[]>) => (this.discounttypes = res.body || []));

    this.selectedSupplier$.subscribe(res => {
      this.selectedSupplier = res;
      // if (this.selectedSupplier) {
      //   this.editForm.patchValue({ 'supplierId': this.selectedSupplier.id });
      // }
    });
  }

  updateForm(discounts: IDiscounts): void {
    this.editForm.patchValue({
      id: discounts.id,
      name: discounts.name,
      description: discounts.description,
      discountCode: discounts.discountCode,
      validFrom: discounts.validFrom ? discounts.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: discounts.validTo ? discounts.validTo.format(DATE_TIME_FORMAT) : null,
      supplierId: discounts.supplierId,
      discountTypeId: discounts.discountTypeId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discounts = this.createFromForm();
    if (discounts.id !== undefined) {
      this.subscribeToSaveResponse(this.discountsService.update(discounts));
    } else {
      this.subscribeToSaveResponse(this.discountsService.create(discounts));
    }
  }

  private createFromForm(): IDiscounts {
    return {
      ...new Discounts(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      discountCode: this.editForm.get(['discountCode'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      supplierId: this.editForm.get(['supplierId'])!.value,
      discountTypeId: this.editForm.get(['discountTypeId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscounts>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

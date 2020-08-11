/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { ProductBrandService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IProductBrand, ProductBrand } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-product-brand-view-edit',
  templateUrl: './product-brand-view-edit.component.html',
  styleUrls: ['./product-brand-view-edit.component.scss']
})
export class ProductBrandViewEditComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;

  get iconPhoto(): string {
    return this.editForm.get('iconPhoto')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    handle: [],
    shortLabel: [],
    sortOrder: [],
    iconFont: [],
    iconPhoto: [],
    activeFlag: [null, [Validators.required]],
    localization: [],
    validFrom: [null, [Validators.required]],
    validTo: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected productBrandService: ProductBrandService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productBrand }) => {
      if (!productBrand.id) {
        const today = moment().startOf('day');
        productBrand.validFrom = today;
        productBrand.validTo = today;
      }

      this.updateForm(productBrand);
    });
  }

  updateForm(productBrand: IProductBrand): void {
    this.editForm.patchValue({
      id: productBrand.id,
      name: productBrand.name,
      handle: productBrand.handle,
      shortLabel: productBrand.shortLabel,
      sortOrder: productBrand.sortOrder,
      iconFont: productBrand.iconFont,
      iconPhoto: productBrand.iconPhoto,
      activeFlag: productBrand.activeFlag,
      localization: productBrand.localization,
      validFrom: productBrand.validFrom ? productBrand.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: productBrand.validTo ? productBrand.validTo.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productBrand = this.createFromForm();
    if (productBrand.id !== undefined) {
      this.subscribeToSaveResponse(this.productBrandService.update(productBrand));
    } else {
      this.subscribeToSaveResponse(this.productBrandService.create(productBrand));
    }
  }

  private createFromForm(): IProductBrand {
    return {
      ...new ProductBrand(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      handle: this.editForm.get(['handle'])!.value,
      shortLabel: this.editForm.get(['shortLabel'])!.value,
      sortOrder: this.editForm.get(['sortOrder'])!.value,
      iconFont: this.editForm.get(['iconFont'])!.value,
      iconPhoto: this.editForm.get(['iconPhoto'])!.value,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      localization: this.editForm.get(['localization'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductBrand>>): void {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

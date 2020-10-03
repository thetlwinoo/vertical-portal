/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { ProductBrandService, WebImageTypesService, WebImagesService, ImagesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IProductBrand, ProductBrand, IWebImages, IWebImageTypes, WebImages } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { filter, map } from 'rxjs/operators';

type SelectableEntity = IWebImageTypes;

@Component({
  selector: 'app-product-brand-view-edit',
  templateUrl: './product-brand-view-edit.component.html',
  styleUrls: ['./product-brand-view-edit.component.scss']
})
export class ProductBrandViewEditComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;

  productBrand: IProductBrand;
  webImages?: IWebImages[];
  webImageTypes: IWebImageTypes[];
  webImageType: IWebImageTypes;
  confirmModal?: NzModalRef;
  eventSubscriber: Subscription;
  expandSet = new Set<number>();

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

  editWebImageForm = this.fb.group({
    id: [],
    title: [],
    subTitle: [],
    url: [null, [Validators.required]],
    priority: [],
    activeFlag: [true, [Validators.required]],
    promoStartDate: [],
    promoEndDate: [],
    webImageTypeId: [],
    webSitemapId: [],
    supplierId: [],
    productCategoryId: [],
    productBrandId: [],
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
    protected imagesService: ImagesService,
    protected webImageTypesService: WebImageTypesService,
    protected webImagesService: WebImagesService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productBrand }) => {
      this.productBrand = productBrand;

      if (!productBrand.id) {
        const today = moment().startOf('day');
        productBrand.validFrom = today;
        productBrand.validTo = today;
      }

      this.updateForm(productBrand);
    });

    this.webImageTypesService
      .query()
      .pipe(
        filter((res: HttpResponse<IWebImageTypes[]>) => res.ok),
        map((res: HttpResponse<IWebImageTypes[]>) => res.body)
      )
      .subscribe(data => {
        this.webImageTypes = data;
        if (data && data.length > 0) {
          this.webImageType = data[0];
        }
      });

    this.loadAll();
    this.registerChangeInWebImages();
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

  registerChangeInWebImages(): void {
    this.eventSubscriber = this.eventManager.subscribe('webImagesListModification', () => this.loadAll());
  }

  loadAll(): void {
    if (this.productBrand) {
      this.webImagesService.query({
        'productBrandId.equals': this.productBrand.id
      }).subscribe((res: HttpResponse<IWebImages[]>) => {
        this.webImages = res.body || [];
        console.log(this.webImages);
      });
    }

  }

  updateWebImageForm(webImages: IWebImages): void {
    this.editWebImageForm.patchValue({
      id: webImages.id,
      title: webImages.title,
      subTitle: webImages.subTitle,
      url: webImages.url,
      priority: webImages.priority,
      activeFlag: webImages.activeFlag,
      promoStartDate: webImages.promoStartDate ? webImages.promoStartDate.format(DATE_TIME_FORMAT) : null,
      promoEndDate: webImages.promoEndDate ? webImages.promoEndDate.format(DATE_TIME_FORMAT) : null,
      webImageTypeId: webImages.webImageTypeId,
      webSitemapId: webImages.webSitemapId,
      supplierId: webImages.supplierId,
      productCategoryId: webImages.productCategoryId,
      productBrandId: webImages.productBrandId,
    });
  }

  private createWebImageFromForm(): IWebImages {
    return {
      ...new WebImages(),
      id: this.editWebImageForm.get(['id'])!.value,
      title: this.editWebImageForm.get(['title'])!.value,
      subTitle: this.editWebImageForm.get(['subTitle'])!.value,
      url: this.editWebImageForm.get(['url'])!.value,
      priority: this.editWebImageForm.get(['priority'])!.value,
      activeFlag: this.editWebImageForm.get(['activeFlag'])!.value,
      promoStartDate: this.editWebImageForm.get(['promoStartDate'])!.value
        ? moment(this.editWebImageForm.get(['promoStartDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      promoEndDate: this.editWebImageForm.get(['promoEndDate'])!.value
        ? moment(this.editWebImageForm.get(['promoEndDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      webImageTypeId: this.editWebImageForm.get(['webImageTypeId'])!.value,
      webSitemapId: this.editWebImageForm.get(['webSitemapId'])!.value,
      supplierId: this.editWebImageForm.get(['supplierId'])!.value,
      productCategoryId: this.editWebImageForm.get(['productCategoryId'])!.value,
      productBrandId: this.editWebImageForm.get(['productBrandId'])!.value,
    };
  }

  uploadWebImage(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        //save
        this.saveWebImage(info.file.response.id);
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  saveWebImage(url?: string) {
    const webImages = this.createWebImageFromForm();

    if (webImages.id !== null) {
      this.webImagesService.update(webImages).subscribe((res) => {
        this.eventManager.broadcast('webImagesListModification');
        this.onExpandChange(res.body, false);
      });
    } else {
      webImages.url = url;
      webImages.productBrandId = this.productBrand.id;
      webImages.webImageTypeId = this.webImageType.id;

      this.webImagesService.create(webImages).subscribe(() => {
        this.eventManager.broadcast('webImagesListModification');
      });
    }

  }

  deleteConfirm(webImage: IWebImages): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this web image?',
      nzContent: 'When clicked the OK button, web image will be deleted from the system',
      nzOnOk: () =>
        this.webImagesService.delete(webImage.id).subscribe(() => {
          this.imagesService.delete(webImage.url).subscribe(() => {
            this.eventManager.broadcast('webImagesListModification');
          });
        })
    });
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  onExpandChange(data: IWebImages, checked: boolean): void {
    this.updateWebImageForm(data);

    if (checked) {
      this.expandSet.add(data.id);
    } else {
      this.expandSet.delete(data.id);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

/* tslint:disable */
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, Observer } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';

import { IProductCategory, ProductCategory, ICulture, ProductCategoryLocalize } from '@vertical/models';
import { ProductCategoryService, CultureService, ProductCategoryLocalizeService } from '@vertical/services';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { takeUntil } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { RootUtils } from '@vertical/utils';

@Component({
  selector: 'app-manage-categories-add',
  templateUrl: './manage-categories-add.component.html',
  styleUrls: ['./manage-categories-add.component.scss']
})
export class ManageCategoriesAddComponent implements OnInit {
  @Input() category: IProductCategory;
  @Input() isRoot: boolean;

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  isSaving = false;
  productcategories: IProductCategory[] = [];
  cultures: ICulture[];
  loading = false;

  get iconPhoto(): string {
    if (this.editForm) {
      return this.editForm.get('iconPhoto').value;
    }
  }

  get iconFont(): string {
    if (this.editForm) {
      return this.editForm.get('iconFont').value;
    }
  }

  get image(): string {
    if (this.editForm) {
      return this.editForm.get('image').value;
    }
  }

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    myanmarName: [],
    handle: [],
    shortLabel: [],
    sortOrder: [],
    iconFont: [],
    iconPhoto: [],
    image: [],
    justForYouInd: [false],
    parentCascade: [],
    activeFlag: [true, [Validators.required]],
    localization: [],
    productExcel: [],
    validFrom: [moment(new Date(), DATE_TIME_FORMAT), [Validators.required]],
    validTo: [],
    parentId: [],
  });

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected productCategoryService: ProductCategoryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private cultureService: CultureService,
    private productCategoryLocalizeService: ProductCategoryLocalizeService,
    private modal: NzModalRef,
  ) { }

  ngOnInit(): void {
    this.createFromForm();

    if (this.category) {
      this.editForm.patchValue({ 'parentId': this.isRoot ? null : this.category?.id });
    }


    this.productCategoryService.query().subscribe((res: HttpResponse<IProductCategory[]>) => (this.productcategories = res.body || []));

    this.cultureService.query().pipe(takeUntil(this.unsubscribe$)).subscribe(res => this.cultures = res.body);
  }

  // ngOnChanges(): void {
  //   console.log(this.category, this.isRoot)
  //   this.editForm.patchValue({ 'parentId': this.isRoot ? null : this.category?.id });
  // }

  beforeUpload = (file: UploadFile, fileList: UploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  }

  uploadIcon(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ 'iconPhoto': info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        console.log('error', info);
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  uploadImage(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ 'image': info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        console.log('error', info);
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }


  previousState(): void {
    window.history.back();
  }

  onSaveItem(item) {
    const englishCultureId = this.getEnglishCulture()?.id;
    const myanmarCultureId = this.getMyanmarCulture()?.id;

    if (item) {
      item.validFrom = item.validFrom ? moment(item.validFrom) : undefined;
      item.validTo = item.validTo ? moment(item.validTo) : undefined;
    }

    this.productCategoryService.update(item)
      .subscribe(
        res => {
          this.saveLocalize(item.englishId, englishCultureId, item.id, item.name);
          this.saveLocalize(item.myanmarId, myanmarCultureId, item.id, item.myanmarName);

          console.log('save success', res, item);
        },
        err => console.log('error', err)
      );
  }

  getEnglishCulture(): ICulture {
    return this.cultures?.find(x => x.code === 'en');
  }

  getMyanmarCulture(): ICulture {
    return this.cultures?.find(x => x.code === 'my');
  }

  private saveLocalize(localizeId: number, cultureId: number, categoryId: number, name: string): void {
    const productCategoryLocalize = new ProductCategoryLocalize();
    productCategoryLocalize.id = localizeId;
    productCategoryLocalize.cultureId = cultureId;
    productCategoryLocalize.productCategoryId = categoryId;
    productCategoryLocalize.name = name;
    if (localizeId) {
      this.productCategoryLocalizeService.update(productCategoryLocalize).subscribe();
    } else {
      this.productCategoryLocalizeService.create(productCategoryLocalize).subscribe();
    }
  }

  private createFromForm(): IProductCategory {
    return {
      ...new ProductCategory(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      handle: this.editForm.get(['handle'])!.value,
      shortLabel: this.editForm.get(['shortLabel'])!.value,
      sortOrder: this.editForm.get(['sortOrder'])!.value,
      iconFont: this.editForm.get(['iconFont'])!.value,
      iconPhoto: this.editForm.get(['iconPhoto'])!.value,
      image: this.editForm.get(['image'])!.value,
      justForYouInd: this.editForm.get(['justForYouInd'])!.value,
      parentCascade: this.editForm.get(['parentCascade'])!.value,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      localization: this.editForm.get(['localization'])!.value,
      productExcel: this.editForm.get(['productExcel'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : moment(new Date(), DATE_TIME_FORMAT),
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      parentId: this.editForm.get(['parentId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCategory>>): void {
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

  trackById(index: number, item: IProductCategory): any {
    return item.id;
  }

  destroyModal(): void {
    this.modal.destroy({ data: this.editForm.getRawValue() });
  }

  onChangeName(event) {
    this.editForm.patchValue({ handle: RootUtils.handleize(event) });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

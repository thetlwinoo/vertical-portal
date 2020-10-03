/* tslint:disable */
import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewContainerRef } from '@angular/core';
import { vsAnimations } from '@vertical/animations';
import { SERVER_API_URL, DATE_TIME_FORMAT } from '@vertical/constants';
import {
  AlertType,
  IAlerts,
  Alerts,
  IProductCategory,
  IPhotos,
  UploadCategory,
  ProductCategory,
  ICulture,
  ProductCategoryLocalize,
  IWebImages,
  IWebImageTypes,
  WebImages
} from '@vertical/models';
import { Subscription, Observer } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, filter, debounceTime, tap } from 'rxjs/operators';
import * as fromProducts from 'app/ngrx/products/reducers';
import { FetchActions, CategoryActions } from 'app/ngrx/products/actions';
import * as _ from 'lodash';
import { ErrorHandler } from '@vertical/utils/error.handler';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile } from 'ng-zorro-antd/upload/interface';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  PhotosService,
  ImagesService,
  ProductCategoryService,
  DocumentProcessService,
  CultureService,
  ProductCategoryLocalizeService,
  WebImageTypesService,
  WebImagesService
} from '@vertical/services';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { RootUtils } from '@vertical/utils';
import * as moment from 'moment';
import { Validators, FormBuilder } from '@angular/forms';
import { NzDropdownMenuComponent, NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { ManageCategoriesAddComponent } from './manage-categories-add/manage-categories-add.component';

type SelectableEntity = IWebImageTypes;

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: vsAnimations,
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {
  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';
  alertMessage: string;
  alertType: AlertType;
  showAlertInd = false;
  alert: IAlerts = new Alerts();
  eventSubscriber: Subscription;
  categories$: Observable<IProductCategory[]>;
  categories: IProductCategory[];
  searchValue = '';
  selectedCategory: any;
  editMode = false;
  loading = false;
  uploadedFiles: any[] = [];
  uploadData$: Observable<UploadCategory[]>;
  uploadData: UploadCategory[];
  loadingUploadExcel = false;
  cultures: ICulture[];
  uploadPercentage = 0;
  nodeExpandInd = false;

  webImages?: IWebImages[];
  webImageTypes: IWebImageTypes[];
  webImageType: IWebImageTypes;
  confirmModal?: NzModalRef;
  expandSet = new Set<number>();

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

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    // protected eventManager: JhiEventManager,
    private store: Store<fromProducts.State>,
    private msg: NzMessageService,
    private photosService: PhotosService,
    private imagesService: ImagesService,
    private productCategoryService: ProductCategoryService,
    private cultureService: CultureService,
    private productCategoryLocalizeService: ProductCategoryLocalizeService,
    protected documentProcessService: DocumentProcessService,
    private modal: NzModalService,
    protected webImageTypesService: WebImageTypesService,
    protected webImagesService: WebImagesService,
    protected eventManager: JhiEventManager,
    private fb: FormBuilder,
    private nzContextMenuService: NzContextMenuService,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.categories$ = store.pipe(select(fromProducts.getFetchCategoriesTree));

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

  ngOnInit(): void {
    this.store.dispatch(FetchActions.fetchCategories());

    this.categories$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => this.categories = data);

    this.uploadData$ = this.documentProcessService.data$.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(0),
      map(data => data.map(item => new UploadCategory(item))),
      tap((data: UploadCategory[]) => data)
    );

    this.cultureService.query().pipe(takeUntil(this.unsubscribe$)).subscribe(res => this.cultures = res.body);

    this.uploadData$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      let uploadCount = 0;

      if (data && this.cultures?.length > 0) {
        const categories = _.groupBy(data, (item) => {
          return item.mainCategoryEnglish;
        });

        _.forEach(categories, (value, key) => {
          categories[key] = _.groupBy(categories[key], (item) => {
            return item.subCategoryEnglish;
          });
        });

        const englishCultureId = this.getEnglishCulture()?.id;
        const myanmarCultureId = this.getMyanmarCulture()?.id;

        _.forEach(categories, (mainValue, mainKey) => {
          const productMainCategory = new ProductCategory();
          productMainCategory.name = mainKey;
          productMainCategory.handle = RootUtils.handleize(mainKey);
          productMainCategory.validFrom = moment();

          const mainData = data.find(x => x.mainCategoryEnglish === mainKey);

          this.productCategoryService.create(productMainCategory).pipe(takeUntil(this.unsubscribe$)).subscribe((mainCategoryRes) => {
            const mainCategory = mainCategoryRes.body;
            this.saveLocalize(null, englishCultureId, mainCategory.id, mainData.mainCategoryEnglish);
            this.saveLocalize(null, myanmarCultureId, mainCategory.id, mainData.mainCategoryMyanmar);

            _.forEach(mainValue, (subValue, subKey) => {
              const productSubCategory = new ProductCategory();
              productSubCategory.name = subKey;
              productSubCategory.handle = RootUtils.handleize(subKey);
              productSubCategory.validFrom = moment();
              productSubCategory.parentId = mainCategory.id;
              productSubCategory.parentName = mainCategory.name;

              const subData = data.find(x => x.subCategoryEnglish === subKey);

              this.productCategoryService.create(productSubCategory).pipe(takeUntil(this.unsubscribe$)).subscribe((subCategoryRes) => {
                const category = subCategoryRes.body;
                category.parentCascade = mainCategory.id + ',' + category.id;
                this.productCategoryService.update(category).subscribe();

                this.saveLocalize(null, englishCultureId, category.id, subData.subCategoryEnglish);
                this.saveLocalize(null, myanmarCultureId, category.id, subData.subCategoryMyanmar);


                _.forEach(subValue, (cagValue, cagKey) => {
                  const productCategory = new ProductCategory();
                  productCategory.name = cagValue.categoryEnglish;
                  productCategory.handle = RootUtils.handleize(cagValue.categoryEnglish);
                  productCategory.validFrom = moment();
                  productCategory.sortOrder = cagKey;
                  productCategory.parentId = category.id;
                  productCategory.parentName = category.name;

                  this.productCategoryService.create(productCategory).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
                    uploadCount++;
                    this.uploadPercentage = Math.floor((uploadCount * 100) / data.length);
                    const leafCategory = res.body;
                    leafCategory.parentCascade = mainCategory.id + ',' + category.id + ',' + leafCategory.id;
                    this.productCategoryService.update(leafCategory).subscribe();
                    this.saveLocalize(null, englishCultureId, leafCategory.id, cagValue.categoryEnglish);
                    this.saveLocalize(null, myanmarCultureId, leafCategory.id, cagValue.categoryMyanmar);

                    if (this.uploadPercentage >= 100) {
                      this.msg.success('You have sucessfully uploaded');
                      this.store.dispatch(FetchActions.fetchCategories());
                    }
                  });
                });
              });
            });
          });
        });
      }
    });
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

  onUpload(event: any): void {
    this.uploadedFiles = [];
    for (const file of event.target.files) {
      this.uploadedFiles.push(file);
    }

    this.documentProcessService.parseExcelFile(this.uploadedFiles[0]);
    this.loadingUploadExcel = false;
  }

  getEnglishCulture(): ICulture {
    return this.cultures?.find(x => x.code === 'en');
  }

  getMyanmarCulture(): ICulture {
    return this.cultures?.find(x => x.code === 'my');
  }

  onEditMode(item) {
    this.editMode = true;
    item.origin = {
      name: item.name,
      shortLabel: item.shortLabel,
      iconFont: item.iconFont,
      iconThumbnailUrl: item.iconThumbnailUrl,
      iconId: item.iconId,
    };
  }

  onSaveItem(item, isRoot?: boolean) {
    const englishCultureId = this.getEnglishCulture()?.id;
    const myanmarCultureId = this.getMyanmarCulture()?.id;

    if (item) {
      item.validFrom = item.validFrom ? moment(item.validFrom) : undefined;
      item.validTo = item.validTo ? moment(item.validTo) : undefined;
    }

    this.editMode = false;

    if (item.id) {
      this.productCategoryService.update(item)
        .subscribe(
          res => {
            if (item.name) {
              this.saveLocalize(item.englishId, englishCultureId, item.id, item.name);
            }

            if (item.myanmarName) {
              this.saveLocalize(item.myanmarId, myanmarCultureId, item.id, item.myanmarName);
            }
          },
          err => console.log('error', err)
        );
    } else {
      this.productCategoryService.create(item)
        .subscribe(
          res => {
            const newCategory = res.body;
            if (item.name) {
              this.saveLocalize(null, englishCultureId, newCategory.id, item.name);
            }

            if (item.myanmarName) {
              this.saveLocalize(null, myanmarCultureId, newCategory.id, item.myanmarName);
            }


            newCategory.parentCascade = isRoot ? null : (this.selectedCategory.parentCascade ? this.selectedCategory.parentCascade : newCategory.parentId) + ',' + newCategory.id;
            this.productCategoryService.update(newCategory).subscribe(res => {
              this.store.dispatch(FetchActions.fetchCategories());
            });

          },
          err => console.log('error', err)
        );
    }

  }

  onCancelMode(item) {
    this.editMode = false;
    item.name = item.origin.name;
    item.shortLabel = item.origin.shortLabel;
    item.iconFont = item.origin.iconFont;
    item.iconThumbnailUrl = item.origin.iconThumbnailUrl;
    item.iconId = item.origin.iconId;
  }

  nzEvent(event: NzFormatEmitEvent): void {
    event.dragNode.origin.parentId = event.node.parentNode ? event.node.parentNode.origin.id : null;
    event.dragNode.origin.parentName = event.node.parentNode ? event.node.parentNode.origin.name : null;
    if (event.dragNode.parentNode) {
      event.dragNode.parentNode.children.map(item => {
        item.origin.sortOrder = event.node.treeService.getIndexOfArray(event.node.parentNode.children, item.key);
        this.onSaveItem(item.origin, item.parentNode ? true : false);
      });
    } else {
      event.dragNode.treeService.rootNodes.map(item => {
        item.origin.sortOrder = event.dragNode.treeService.getIndexOfArray(event.dragNode.treeService.rootNodes, item.key);
        this.onSaveItem(item.origin, item.parentNode ? true : false);
      });
    }

    this.onSaveItem(event.dragNode.origin, event.dragNode.parentNode ? true : false);
    this.msg.success('You have sucessfully updated');
  }

  activeNode(event: NzFormatEmitEvent): void {
    this.selectedCategory = event.node.origin;

    this.eventManager.broadcast('webImagesListModification');
    console.log(this.selectedCategory);
  }

  showAlert(type: AlertType, message: string): void {
    this.alert.message = message;
    this.alert.type = type;
    this.showAlertInd = true;
  }

  showUpdateConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>Update Categories</i>',
      nzContent: '<b>Are you sure want to update for all categories?</b>',
      nzOnOk: () => this.save()
    });
  }

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

  save() {
    this.categories.forEach(item => {

      if (item) {
        item.validFrom = item.validFrom ? moment(item.validFrom) : undefined;
        item.validTo = item.validTo ? moment(item.validTo) : undefined;
      }

      this.productCategoryService.update(item)
        .subscribe(
          res => {
            console.log('save success', res);
          },
          err => console.log('error', err)
        );
    });
  }
  // private getBase64(img: File, callback: (img: string) => void): void {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result!.toString()));
  //   reader.readAsDataURL(img);
  // }
  // savePhoto(photos: IPhotos): void {
  //   if (photos.id !== undefined) {
  //     this.subscribeToSaveResponse(this.photosService.updateExtend(photos));
  //   } else {
  //     this.subscribeToSaveResponse(this.photosService.createExtend(photos));
  //   }
  // }

  uploadIcon(info: { file: UploadFile }, entity: IProductCategory): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        entity.iconPhoto = info.file.response.id;
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  uploadImage(info: { file: UploadFile }, entity: IProductCategory): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        entity.image = info.file.response.id;
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  nodeExpand(expand): void {
    this.nodeExpandInd = expand;

    if (!expand) {
      this.store.dispatch(FetchActions.fetchCategories());
    }
  }



  loadAll(): void {
    if (this.selectedCategory) {
      this.webImagesService.query({
        'productCategoryId.equals': this.selectedCategory.id
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

    console.log('webImages', webImages)
    if (webImages.id !== null) {
      this.webImagesService.update(webImages).subscribe((res) => {
        this.eventManager.broadcast('webImagesListModification');
        this.onExpandChange(res.body, false);
      });
    } else {
      webImages.url = url;
      webImages.productCategoryId = this.selectedCategory.id;
      webImages.webImageTypeId = this.webImageType.id;

      this.webImagesService.create(webImages).subscribe(() => {
        this.eventManager.broadcast('webImagesListModification');
      });
    }

  }

  deleteConfirm(webImage: IWebImages): void {
    console.log('webImage', webImage)
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this web image?',
      nzContent: 'When clicked the OK button, web image will be deleted from the system',
      nzOnOk: () =>
        this.webImagesService.delete(webImage.id).subscribe((res) => {
          this.imagesService.delete(webImage.url).subscribe(() => {
            this.eventManager.broadcast('webImagesListModification');
          });
        })
    });
  }

  deleteConfirmNode(category: IProductCategory): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this category?',
      nzContent: 'When clicked the OK button, selected category and related childs will be deleted from the system',
      nzOnOk: () =>
        this.productCategoryService.deleteExtend(category.id).subscribe((res) => {
          const result: any[] = res.body || [];
          if (result.length > 0) {
            result.map(x => {
              this.imagesService.delete(x.id).subscribe();
            })
          }

          this.store.dispatch(FetchActions.fetchCategories());
        })
    });
  }

  registerChangeInWebImages(): void {
    this.eventSubscriber = this.eventManager.subscribe('webImagesListModification', () => this.loadAll());
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

  onAddRoot() {
    this.createCategoryModel(true, 'Add Root Category');
  }

  onAddChildNode(event) {
    if (this.selectedCategory) {
      this.createCategoryModel(false, 'Add Child Node | ' + this.selectedCategory.name);
    } else {
      this.msg.error('Please select category first to add child!');
    }

  }

  onDeleteNode(event) {
    console.log(event);
  }

  createCategoryModel(isRoot: boolean, title: string) {
    this.modal.create({
      nzTitle: title,
      nzContent: ManageCategoriesAddComponent,
      nzViewContainerRef: this.viewContainerRef,
      // nzGetContainer: () => document.body,
      nzComponentParams: {
        category: this.selectedCategory,
        isRoot
      },
      nzClosable: false,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Save',
          type: 'primary',
          disabled: componentInstance => {
            return componentInstance!.editForm.invalid;
          },
          onClick: componentInstance => {
            // console.log(componentInstance!.editForm.getRawValue())
            this.onSaveItem(componentInstance!.editForm.getRawValue(), isRoot);
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

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhotos>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      (error: HttpErrorResponse) => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(event): void {
    this.loading = false;
    console.log('event', event);
  }

  protected onSaveError(error: HttpErrorResponse): void {
    this.onError(error);
  }

  protected onError(error: HttpErrorResponse): void {
    this.loading = false;
    this.msg.error(ErrorHandler.getErrorMessage(error));
  }
}

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { vsAnimations } from '@vertical/animations';
import { SERVER_API_URL } from '@vertical/constants';
import { AlertType, IAlerts, Alerts, IProductCategory, IPhotos, UploadCategory, ProductCategory, ICulture, ProductCategoryLocalize } from '@vertical/models';
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
import { PhotosService, ImagesService, ProductCategoryService, DocumentProcessService, CultureService, ProductCategoryLocalizeService } from '@vertical/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RootUtils } from '@vertical/utils';
import * as moment from 'moment';

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
    private modal: NzModalService
  ) {
    this.categories$ = store.pipe(select(fromProducts.getFetchCategoriesTree));
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

  onSaveItem(item) {
    const englishCultureId = this.getEnglishCulture()?.id;
    const myanmarCultureId = this.getMyanmarCulture()?.id;

    if (item) {
      item.validFrom = item.validFrom ? moment(item.validFrom) : undefined;
      item.validTo = item.validTo ? moment(item.validTo) : undefined;
    }

    console.log('item', item)
    this.editMode = false;
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
      });
    } else {
      event.dragNode.treeService.rootNodes.map(item => {
        item.origin.sortOrder = event.dragNode.treeService.getIndexOfArray(event.dragNode.treeService.rootNodes, item.key);
      });
    }
  }

  nzClick(event: NzFormatEmitEvent): void {
    this.selectedCategory = event.node.origin;
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

  handleChange(info: { file: UploadFile }, entity: IProductCategory): void {
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

  nodeExpand(expand): void {
    this.nodeExpandInd = expand;
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

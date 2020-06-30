import { Component, OnInit, ViewEncapsulation, OnDestroy, ElementRef } from '@angular/core';
import { TranslationLoaderService, ImagesService } from '@vertical/services';
import { vsAnimations } from '@vertical/animations';

import { locale as english } from './i18n/en';
import { locale as myanmar } from './i18n/mm';

import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, Observer, of } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IStockItems, IPhotos, Photos, AlertType, IAlerts, Alerts } from '@vertical/models';
import { StockItemsService, PhotosService } from '@vertical/services';
import { AccountService } from '@vertical/core';
import { ImageUtils } from '@vertical/services';
// import { ImagesMissingFilterPipe } from '../shared/filters/manage-images-missing.pipe';
import { ErrorHandler } from '@vertical/utils/error.handler';
import { UploadFile } from 'ng-zorro-antd/upload';
import { SERVER_API_URL } from '@vertical/constants';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-images',
  templateUrl: './manage-images.component.html',
  styleUrls: ['./manage-images.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: vsAnimations,
})
export class ManageImagesComponent implements OnInit, OnDestroy {
  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';
  currentAccount: any;
  stockItems: IStockItems[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  loading = true;
  selectedRows: any;

  closeAlertInd = true;
  alertMessage: string;
  alertType: AlertType;
  missingImageInd = false;

  previewImage: string | undefined = '';
  previewVisible = false;
  showAlertInd = false;
  alert: IAlerts = new Alerts();
  fileTypes = 'image/png,image/jpeg';

  constructor(
    private translationLoaderService: TranslationLoaderService,
    protected stockItemsService: StockItemsService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected elementRef: ElementRef,
    // protected dataUtils: JhiDataUtils,
    protected imageUtils: ImageUtils,
    // private imageMissingFilterPipe: ImagesMissingFilterPipe,
    private msg: NzMessageService,
    private photosService: PhotosService,
    private imagesService: ImagesService,
  ) {
    this.itemsPerPage = 10;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.accountService.identity().pipe(
      map(account => {
        this.currentAccount = account;
      })
    );

    this.registerChanged();
    this.translationLoaderService.loadTranslations(english, myanmar);
  }

  save(photos: IPhotos): void {
    if (photos.id !== undefined) {
      this.subscribeToSaveResponse(this.photosService.updateExtend(photos));
    } else {
      this.subscribeToSaveResponse(this.photosService.createExtend(photos));
    }
  }

  loadAll(): void {
    this.stockItemsService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IStockItems[]>) => this.paginateStockItems(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res)
      );
  }

  loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition(): void {
    this.router.navigate(['/products/manage-images'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    });
    this.loadAll();
  }

  clear(): void {
    this.page = 0;
    this.router.navigate([
      '/products/manage-products',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    ]);
    this.loadAll();
  }

  trackId(index: number, item: IStockItems): number {
    return item.id;
  }

  registerChanged(): void {
    this.eventSubscriber = this.eventManager.subscribe('stockItemsListModification', () => this.loadAll());
    this.eventSubscriber = this.eventManager.subscribe('photosListModification', () => this.loadAll());
  }

  sort(): any {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  showAlert(type: AlertType, message: string): void {
    this.alert.message = message;
    this.alert.type = type;
    this.showAlertInd = true;
  }

  beforeUpload = (file: UploadFile, fileList: UploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      // tslint:disable-next-line: no-non-null-assertion
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

  handleChange(info, entity): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        // Get this url from response in real world.
        const photos: IPhotos = new Photos();
        photos.thumbnailUrl = info.file.response.thumbUrl;
        photos.originalUrl = info.file.response.url;
        photos.blobId = info.file.response.id;
        photos.stockItemId = entity.id;
        this.save(photos);
        break;
      case 'error':
        this.msg.error('Network error');
        break;
    }
  }

  handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  removeUpload = (file: UploadFile, fileList: UploadFile[]) => {
    const deleteId = file.response ? file.response.id : file.uid;
    this.photosService.deleteByBlodId(deleteId).subscribe();
    this.imagesService.delete(deleteId).subscribe();
    return of(true);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;

    this.loading = true;
    this.itemsPerPage = pageSize;
    this.page = pageIndex;
    this.loadPage(this.page);
  }


  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.eventSubscriber);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhotos>>): void {
    result.subscribe(
      res => this.onSaveSuccess(res),
      (error: HttpErrorResponse) => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(event): void {
    console.log('event', event);
  }

  protected onSaveError(error: HttpErrorResponse): void {
    this.onError(error);
  }

  protected paginateStockItems(data: IStockItems[], headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);

    data.forEach(stockItem => {
      this.photosService
        .query({
          'stockItemId.equals': stockItem.id,
        })
        .pipe(
          filter((res: HttpResponse<IPhotos[]>) => res.ok),
          map((res: HttpResponse<IPhotos[]>) => res.body)
        )
        .subscribe((res: IPhotos[]) => {
          stockItem.photoLists = [];
          res.map(item => {
            stockItem.photoLists.push({
              uid: item.blobId.toString(),
              name: item.blobId,
              status: 'done',
              thumbUrl: `${this.blobUrl}${item.thumbnailUrl}`,
              url: `${this.blobUrl}${item.originalUrl}`,
              photoId: item.id,
              defaultInd: item.defaultInd,
            });
          });
        });
    });

    this.stockItems = data;

    this.loading = false;
  }

  protected onError(error: HttpErrorResponse): void {
    this.loading = false;
    this.msg.error(ErrorHandler.getErrorMessage(error));
  }
}

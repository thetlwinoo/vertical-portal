/* tslint:disable */
import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { WebSitemapService, WebImageTypesService, WebImagesService, ImagesService } from '@vertical/services';
import { ActivatedRoute, Router } from '@angular/router';
import { IWebSitemap, WebSitemap, IWebImageTypes, IWebImages, WebImages } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL, ITEMS_PER_PAGE } from '@vertical/constants';
import { Observable, Subject, Observer, Subscription } from 'rxjs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RootUtils } from '@vertical/utils';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Moment } from 'moment';

type SelectableEntity = IWebImageTypes;

@Component({
  selector: 'app-web-sitemap-view-edit',
  templateUrl: './web-sitemap-view-edit.component.html',
  styleUrls: ['./web-sitemap-view-edit.component.scss'],
})
export class WebSitemapViewEditComponent implements OnInit, OnDestroy {
  @ViewChild('editor', {
    static: true
  }) editor: QuillEditorComponent

  isSaving = false;
  loading = false;
  webImageTypes: IWebImageTypes[];
  selectedWebImageType: IWebImageTypes;
  fileList: UploadFile[] = [];
  webSitemap: IWebSitemap;

  eventSubscriber?: Subscription;
  webImages?: IWebImages[];
  confirmModal?: NzModalRef;
  expandSet = new Set<number>();

  get iconPhoto(): string {
    return this.editForm.get('iconPhoto')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    shortLabel: [null, [Validators.required]],
    handle: [null, [Validators.required]],
    title: [],
    subTitle: [],
    parentId: [],
    url: [],
    exactMatch: [],
    extraQuery: [],
    iconFont: [],
    iconPhoto: [],
    priority: [],
    activeFlag: [null, [Validators.required]],
    content: [],
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
    protected webSitemapService: WebSitemapService,
    protected webImageTypesService: WebImageTypesService,
    protected imagesService: ImagesService,
    protected webImagesService: WebImagesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    protected router: Router,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ webSitemap }) => {
      if (!webSitemap.id) {
        const today = moment().startOf('day');
        webSitemap.validFrom = today;
        webSitemap.validTo = today;
      }

      this.webSitemap = webSitemap;
      this.updateForm(webSitemap);
    });

    this.editor
      .onContentChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((data: ContentChange) => {
        // tslint:disable-next-line:no-console
        console.log('view child + directly subscription', data)
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
          // this.editForm.patchValue({ webImageType: data[0] });
          this.selectedWebImageType = data[0];
        }
      });

    this.loadAll();
    this.registerChangeInWebImages();
  }

  updateForm(webSitemap: IWebSitemap): void {
    this.editForm.patchValue({
      id: webSitemap.id,
      name: webSitemap.name,
      shortLabel: webSitemap.shortLabel,
      handle: webSitemap.handle,
      title: webSitemap.title,
      subTitle: webSitemap.subTitle,
      parentId: webSitemap.parentId,
      url: webSitemap.url,
      exactMatch: webSitemap.exactMatch,
      extraQuery: webSitemap.extraQuery,
      iconFont: webSitemap.iconFont,
      iconPhoto: webSitemap.iconPhoto,
      priority: webSitemap.priority,
      activeFlag: webSitemap.activeFlag,
      content: webSitemap.content,
      validFrom: webSitemap.validFrom ? webSitemap.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: webSitemap.validTo ? webSitemap.validTo.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const webSitemap = this.createFromForm();
    if (webSitemap.id !== undefined) {
      this.subscribeToSaveResponse(this.webSitemapService.update(webSitemap));
    } else {
      this.subscribeToSaveResponse(this.webSitemapService.create(webSitemap));
    }
  }

  private createFromForm(): IWebSitemap {
    return {
      ...new WebSitemap(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      shortLabel: this.editForm.get(['shortLabel'])!.value,
      handle: this.editForm.get(['handle'])!.value,
      title: this.editForm.get(['title'])!.value,
      subTitle: this.editForm.get(['subTitle'])!.value,
      parentId: this.editForm.get(['parentId'])!.value,
      url: this.editForm.get(['url'])!.value,
      exactMatch: this.editForm.get(['exactMatch'])!.value,
      extraQuery: this.editForm.get(['extraQuery'])!.value,
      iconFont: this.editForm.get(['iconFont'])!.value,
      iconPhoto: this.editForm.get(['iconPhoto'])!.value,
      priority: this.editForm.get(['priority'])!.value,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      content: this.editForm.get(['content'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWebSitemap>>): void {
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

  onClear(event) {
    this.editForm.patchValue({ content: null });
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
      webImages.webSitemapId = this.webSitemap.id;
      webImages.webImageTypeId = this.selectedWebImageType.id;

      this.webImagesService.create(webImages).subscribe(() => {
        this.eventManager.broadcast('webImagesListModification');
      });
    }

  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  loadAll(): void {
    this.webImagesService.query({
      'webSitemapId.equals': this.webSitemap.id
    }).subscribe((res: HttpResponse<IWebImages[]>) => {
      this.webImages = res.body || [];
      console.log(this.webImages);
    });
  }

  registerChangeInWebImages(): void {
    this.eventSubscriber = this.eventManager.subscribe('webImagesListModification', () => this.loadAll());
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

    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }
}

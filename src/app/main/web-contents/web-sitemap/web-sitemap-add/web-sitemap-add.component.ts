/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { WebSitemapService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IWebSitemap, WebSitemap } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RootUtils } from '@vertical/utils';

@Component({
  selector: 'app-web-sitemap-add',
  templateUrl: './web-sitemap-add.component.html',
  styleUrls: ['./web-sitemap-add.component.scss']
})
export class WebSitemapAddComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;

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

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected webSitemapService: WebSitemapService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ webSitemap }) => {
      if (!webSitemap.id) {
        const today = moment().startOf('day');
        webSitemap.validFrom = today;
        webSitemap.validTo = today;

        console.log('webSitemap', webSitemap)
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const webSitemap = this.createFromForm();
    if (webSitemap.id) {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

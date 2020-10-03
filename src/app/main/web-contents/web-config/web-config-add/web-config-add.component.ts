/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { WebConfigService, WebThemesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IWebConfig, WebConfig, IWebThemes } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-web-config-add',
  templateUrl: './web-config-add.component.html',
  styleUrls: ['./web-config-add.component.scss']
})
export class WebConfigAddComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;
  webthemes: IWebThemes[] = [];

  get iconPhoto(): string {
    return this.editForm.get('iconPhoto')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    activeFlag: [],
    webThemeId: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected webConfigService: WebConfigService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    protected webThemesService: WebThemesService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ webConfig }) => {
      this.webThemesService.query().subscribe((res: HttpResponse<IWebThemes[]>) => (this.webthemes = res.body || []));
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const webConfig = this.createFromForm();
    if (webConfig.id) {
      this.subscribeToSaveResponse(this.webConfigService.update(webConfig));
    } else {
      this.subscribeToSaveResponse(this.webConfigService.create(webConfig));
    }
  }

  private createFromForm(): IWebConfig {
    return {
      ...new WebConfig(),
      id: this.editForm.get(['id'])!.value,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      webThemeId: this.editForm.get(['webThemeId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWebConfig>>): void {
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

  trackById(index: number, item: IWebThemes): any {
    return item.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

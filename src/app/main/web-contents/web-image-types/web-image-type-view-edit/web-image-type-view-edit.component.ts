/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { WebImageTypesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IWebImageTypes, WebImageTypes } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RootUtils } from '@vertical/utils';

@Component({
  selector: 'app-web-image-type-view-edit',
  templateUrl: './web-image-type-view-edit.component.html',
  styleUrls: ['./web-image-type-view-edit.component.scss']
})
export class WebImageTypeViewEditComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;

  get iconPhoto(): string {
    return this.editForm.get('iconPhoto')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    handle: [null, [Validators.required]],
    width: [],
    height: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected webImageTypeService: WebImageTypesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ webImageType }) => {
      if (!webImageType.id) {
        const today = moment().startOf('day');
        webImageType.validFrom = today;
        webImageType.validTo = today;
      }

      this.updateForm(webImageType);
    });
  }

  updateForm(webImageType: IWebImageTypes): void {
    this.editForm.patchValue({
      id: webImageType.id,
      name: webImageType.name,
      handle: webImageType.handle,
      width: webImageType.width,
      height: webImageType.height,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const webImageType = this.createFromForm();
    if (webImageType.id !== undefined) {
      this.subscribeToSaveResponse(this.webImageTypeService.update(webImageType));
    } else {
      this.subscribeToSaveResponse(this.webImageTypeService.create(webImageType));
    }
  }

  private createFromForm(): IWebImageTypes {
    return {
      ...new WebImageTypes(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      handle: this.editForm.get(['handle'])!.value,
      width: this.editForm.get(['width'])!.value,
      height: this.editForm.get(['height'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWebImageTypes>>): void {
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

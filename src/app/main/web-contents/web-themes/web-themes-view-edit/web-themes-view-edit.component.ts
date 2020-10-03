/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { WebThemesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IWebThemes, WebThemes } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-web-themes-view-edit',
  templateUrl: './web-themes-view-edit.component.html',
  styleUrls: ['./web-themes-view-edit.component.scss']
})
export class WebThemesViewEditComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;

  get iconPhoto(): string {
    return this.editForm.get('iconPhoto')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    name: [],
    fontSize: [],
    fontColor: [],
    fontWeight: [],
    fontFamily: [],
    primaryColor: [],
    secondaryColor: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected webThemesService: WebThemesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ webThemes }) => {
      if (!webThemes.id) {
        const today = moment().startOf('day');
        webThemes.validFrom = today;
        webThemes.validTo = today;
      }

      this.updateForm(webThemes);
    });
  }

  updateForm(webThemes: IWebThemes): void {
    this.editForm.patchValue({
      id: webThemes.id,
      name: webThemes.name,
      fontSize: webThemes.fontSize,
      fontColor: webThemes.fontColor,
      fontWeight: webThemes.fontWeight,
      fontFamily: webThemes.fontFamily,
      primaryColor: webThemes.primaryColor,
      secondaryColor: webThemes.secondaryColor,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const webThemes = this.createFromForm();
    if (webThemes.id !== undefined) {
      this.subscribeToSaveResponse(this.webThemesService.update(webThemes));
    } else {
      this.subscribeToSaveResponse(this.webThemesService.create(webThemes));
    }
  }

  private createFromForm(): IWebThemes {
    return {
      ...new WebThemes(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      fontSize: this.editForm.get(['fontSize'])!.value,
      fontColor: this.editForm.get(['fontColor'])!.value,
      fontWeight: this.editForm.get(['fontWeight'])!.value,
      fontFamily: this.editForm.get(['fontFamily'])!.value,
      primaryColor: this.editForm.get(['primaryColor'])!.value,
      secondaryColor: this.editForm.get(['secondaryColor'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWebThemes>>): void {
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

/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { DiscountTypesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IDiscountTypes, DiscountTypes } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { Observable, Subject, Observer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RootUtils } from '@vertical/utils';

@Component({
  selector: 'app-discount-types-view-edit',
  templateUrl: './discount-types-view-edit.component.html',
  styleUrls: ['./discount-types-view-edit.component.scss']
})
export class DiscountTypesViewEditComponent implements OnInit, OnDestroy {
  isSaving = false;
  loading = false;

  get iconPhoto(): string {
    return this.editForm.get('iconPhoto')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    shortLabel: [],
    handle: [],
    modifiedDate: [null, [Validators.required]],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected discountTypesService: DiscountTypesService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discountTypes }) => {
      const today = moment().startOf('day');
      discountTypes.modifiedDate = today;

      this.updateForm(discountTypes);
    });
  }

  updateForm(discountTypes: IDiscountTypes): void {
    this.editForm.patchValue({
      id: discountTypes.id,
      name: discountTypes.name,
      shortLabel: discountTypes.shortLabel,
      handle: discountTypes.handle,
      modifiedDate: discountTypes.modifiedDate ? discountTypes.modifiedDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discountTypes = this.createFromForm();
    if (discountTypes.id !== undefined) {
      this.subscribeToSaveResponse(this.discountTypesService.update(discountTypes));
    } else {
      this.subscribeToSaveResponse(this.discountTypesService.create(discountTypes));
    }
  }

  private createFromForm(): IDiscountTypes {
    return {
      ...new DiscountTypes(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      shortLabel: this.editForm.get(['shortLabel'])!.value,
      handle: this.editForm.get(['handle'])!.value,
      modifiedDate: this.editForm.get(['modifiedDate'])!.value
        ? moment(this.editForm.get(['modifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscountTypes>>): void {
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

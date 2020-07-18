/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService, PhotosService, SuppliersService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IPhotos, ISuppliers, People, IPeople, Photos } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { HttpResponse } from '@angular/common/http';
import { Observable, Observer, Subject } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd/upload';
import { takeUntil, filter, map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

type SelectableEntity = IPhotos | ISuppliers;

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit, OnDestroy {

  isSaving = false;
  photos: IPhotos[] = [];
  suppliers: ISuppliers[] = [];
  people: IPeople;
  loading = false;

  editForm = this.fb.group({
    id: [],
    fullName: [null, [Validators.required]],
    preferredName: [null, [Validators.required]],
    searchName: [null, [Validators.required]],
    gender: [],
    dateOfBirth: [],
    isPermittedToLogon: [null, [Validators.required]],
    logonName: [],
    isExternalLogonProvider: [null, [Validators.required]],
    isSystemUser: [null, [Validators.required]],
    isEmployee: [null, [Validators.required]],
    isSalesPerson: [null, [Validators.required]],
    isGuestUser: [null, [Validators.required]],
    emailPromotion: [null, [Validators.required]],
    userPreferences: [],
    phoneNumber: [],
    emailAddress: [null, [Validators.required, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    customFields: [],
    otherLanguages: [],
    userId: [null, [Validators.required]],
    validFrom: [null, [Validators.required]],
    validTo: [],
    profileId: [],
    supplierId: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected peopleService: PeopleService,
    protected photosService: PhotosService,
    protected suppliersService: SuppliersService,
    protected activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ people }) => {
      if (people && !people.id) {
        const today = moment().startOf('day');
        people.dateOfBirth = today;
        people.validFrom = today;
        people.validTo = today;
      }

      this.people = people;

      this.photosService.query().subscribe((res: HttpResponse<IPhotos[]>) => (this.photos = res.body || []));

      this.suppliersService.query().subscribe((res: HttpResponse<ISuppliers[]>) => (this.suppliers = res.body || []));
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const people = this.createFromForm();
    this.subscribeToSaveResponse(this.peopleService.create(people));
  }

  // tslint:disable-next-line: no-non-null-assertion
  private createFromForm(): IPeople {
    return {
      ...new People(),
      id: this.editForm.get(['id'])!.value,
      fullName: this.editForm.get(['fullName'])!.value,
      preferredName: this.editForm.get(['preferredName'])!.value,
      searchName: this.editForm.get(['searchName'])!.value,
      gender: this.editForm.get(['gender'])!.value,
      dateOfBirth: this.editForm.get(['dateOfBirth'])!.value
        ? moment(this.editForm.get(['dateOfBirth'])!.value, DATE_TIME_FORMAT)
        : undefined,
      isPermittedToLogon: this.editForm.get(['isPermittedToLogon'])!.value,
      logonName: this.editForm.get(['logonName'])!.value,
      isExternalLogonProvider: this.editForm.get(['isExternalLogonProvider'])!.value,
      isSystemUser: this.editForm.get(['isSystemUser'])!.value,
      isEmployee: this.editForm.get(['isEmployee'])!.value,
      isSalesPerson: this.editForm.get(['isSalesPerson'])!.value,
      isGuestUser: this.editForm.get(['isGuestUser'])!.value,
      emailPromotion: this.editForm.get(['emailPromotion'])!.value,
      userPreferences: this.editForm.get(['userPreferences'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      emailAddress: this.editForm.get(['emailAddress'])!.value,
      customFields: this.editForm.get(['customFields'])!.value,
      otherLanguages: this.editForm.get(['otherLanguages'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      profilePhoto: this.editForm.get(['profilePhoto'])!.value,
      supplierId: this.editForm.get(['supplierId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPeople>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
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

  handleChange(info: { file: UploadFile }, entity): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ profilePhoto: info.file.response.id });
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

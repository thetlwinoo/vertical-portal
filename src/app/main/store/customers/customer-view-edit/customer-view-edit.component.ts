/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService, PhotosService, CustomersService, AddressesService, DeliveryMethodsService, ImagesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IPhotos, ICustomers, Photos, Customers, IAddresses, IDeliveryMethods, IPeople } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { HttpResponse } from '@angular/common/http';
import { Observable, Observer, Subject, of } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
type SelectableEntity = IAddresses | IDeliveryMethods | IPeople;

type SelectableManyToManyEntity = IDeliveryMethods | IPeople;

@Component({
  selector: 'app-customer-view-edit',
  templateUrl: './customer-view-edit.component.html',
  styleUrls: ['./customer-view-edit.component.scss']
})
export class CustomerViewEditComponent implements OnInit {
  isSaving = false;
  addresses: IAddresses[] = [];
  deliverymethods: IDeliveryMethods[] = [];
  people: IPeople[] = [];
  loading = false;
  uploading = false;
  customers: ICustomers;
  previewImage: string | undefined = '';
  previewVisible = false;
  deliveryAddressId: number;
  billToAddressId: number;

  get profilePhoto(): string {
    return this.editForm.get('profilePhoto')?.value || null;
  }

  get name(): string {
    return this.editForm.get('name')?.value || null;
  }

  editForm = this.fb.group({
    id: [],
    name: [],
    accountNumber: [null, [Validators.required]],
    accountOpenedDate: [null, [Validators.required]],
    standardDiscountPercentage: [null, [Validators.required]],
    isStatementSent: [null, [Validators.required]],
    isOnCreditHold: [null, [Validators.required]],
    paymentDays: [null, [Validators.required]],
    deliveryRun: [],
    runPosition: [],
    profilePhoto: [],
    billToAddressSameAsDeliveryAddress: [],
    lastEditedBy: [null, [Validators.required]],
    activeFlag: [null, [Validators.required]],
    validFrom: [null, [Validators.required]],
    validTo: [],
    peopleId: [],
    deliveryMethodId: [],
    deliveryAddressId: [],
    billToAddressId: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected customersService: CustomersService,
    protected addressesService: AddressesService,
    protected deliveryMethodsService: DeliveryMethodsService,
    protected photosService: PhotosService,
    protected imagesService: ImagesService,
    protected peopleService: PeopleService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customers }) => {
      console.log(customers);
      if (customers?.id) {
        this.customers = customers;
        this.deliveryAddressId = customers.deliveryAddressId;
        this.billToAddressId = customers.billToAddressId;

        this.updateForm(customers);

        this.addressesService.query({ 'customerId.equals': customers.id }).subscribe((res: HttpResponse<IAddresses[]>) => (this.addresses = res.body || []));
      }

      this.deliveryMethodsService.query().subscribe((res: HttpResponse<IDeliveryMethods[]>) => (this.deliverymethods = res.body || []));

      this.peopleService.query().subscribe((res: HttpResponse<IPeople[]>) => (this.people = res.body || []));
    });
  }

  updateForm(customers: ICustomers): void {
    this.editForm.patchValue({
      id: customers.id,
      name: customers.name,
      accountNumber: customers.accountNumber,
      accountOpenedDate: customers.accountOpenedDate ? customers.accountOpenedDate.format(DATE_TIME_FORMAT) : null,
      standardDiscountPercentage: customers.standardDiscountPercentage,
      isStatementSent: customers.isStatementSent,
      isOnCreditHold: customers.isOnCreditHold,
      paymentDays: customers.paymentDays,
      deliveryRun: customers.deliveryRun,
      runPosition: customers.runPosition,
      profilePhoto: customers.profilePhoto,
      billToAddressSameAsDeliveryAddress: customers.billToAddressSameAsDeliveryAddress,
      lastEditedBy: customers.lastEditedBy,
      activeFlag: customers.activeFlag,
      validFrom: customers.validFrom ? customers.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: customers.validTo ? customers.validTo.format(DATE_TIME_FORMAT) : null,
      peopleId: customers.peopleId,
      deliveryMethodId: customers.deliveryMethodId,
      deliveryAddressId: customers.deliveryAddressId,
      billToAddressId: customers.billToAddressId,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customers = this.createFromForm();
    this.subscribeToSaveResponse(this.customersService.update(customers));
  }

  saveAddress(): void {
    const customers = this.createFromForm();
    this.customersService.update(customers).subscribe((res) => this.msg.success('Save Addresses Sucessfully'));
  }

  private createFromForm(): ICustomers {
    return {
      ...new Customers(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      accountNumber: this.editForm.get(['accountNumber'])!.value,
      accountOpenedDate: this.editForm.get(['accountOpenedDate'])!.value
        ? moment(this.editForm.get(['accountOpenedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      standardDiscountPercentage: this.editForm.get(['standardDiscountPercentage'])!.value,
      isStatementSent: this.editForm.get(['isStatementSent'])!.value,
      isOnCreditHold: this.editForm.get(['isOnCreditHold'])!.value,
      paymentDays: this.editForm.get(['paymentDays'])!.value,
      deliveryRun: this.editForm.get(['deliveryRun'])!.value,
      runPosition: this.editForm.get(['runPosition'])!.value,
      profilePhoto: this.editForm.get(['profilePhoto'])!.value,
      billToAddressSameAsDeliveryAddress: this.editForm.get(['billToAddressSameAsDeliveryAddress'])!.value,
      lastEditedBy: this.editForm.get(['lastEditedBy'])!.value,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      peopleId: this.editForm.get(['peopleId'])!.value,
      deliveryMethodId: this.editForm.get(['deliveryMethodId'])!.value,
      deliveryAddressId: this.editForm.get(['deliveryAddressId'])!.value,
      billToAddressId: this.editForm.get(['billToAddressId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomers>>): void {
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

  getSelected(selectedVals: SelectableManyToManyEntity[], option: SelectableManyToManyEntity): SelectableManyToManyEntity {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
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

  removeUpload = (file: UploadFile, fileList: UploadFile[]) => {
    const deleteId = file.response ? file.response.id : file.uid;
    this.photosService.deleteByBlodId(deleteId).subscribe();
    this.imagesService.delete(deleteId).subscribe();
    return of(true);
  }

  handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  }

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handleChange(info: { file: UploadFile }): void {
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

  deliveryAddressChanged(event): void {
    this.editForm.patchValue({ deliveryAddressId: event });
  }

  billToAddressChanged(event): void {
    this.editForm.patchValue({ billToAddressId: event });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

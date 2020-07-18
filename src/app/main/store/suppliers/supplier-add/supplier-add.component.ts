/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService, PhotosService, SuppliersService, SupplierCategoriesService, AddressesService, DeliveryMethodsService } from '@vertical/services';
import { ActivatedRoute, Router } from '@angular/router';
import { IPhotos, ISuppliers, Photos, Suppliers, ISupplierCategories, IAddresses, IDeliveryMethods, IPeople } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { HttpResponse } from '@angular/common/http';
import { Observable, Observer, Subject } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';

type SelectableEntity = ISupplierCategories | IAddresses | IDeliveryMethods | IPeople;

type SelectableManyToManyEntity = IDeliveryMethods | IPeople;

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.scss']
})
export class SupplierAddComponent implements OnInit {

  isSaving = false;
  suppliercategories: ISupplierCategories[] = [];
  addresses: IAddresses[] = [];
  deliverymethods: IDeliveryMethods[] = [];
  people: IPeople[] = [];
  loading = false;

  get logo(): string {
    return this.editForm.get('logo')?.value || null;
  }

  get nricFrontPhoto(): string {
    return this.editForm.get('nricFrontPhoto')?.value || null;
  }

  get nricBackPhoto(): string {
    return this.editForm.get('nricBackPhoto')?.value || null;
  }

  get bankBookPhoto(): string {
    return this.editForm.get('bankBookPhoto')?.value || null;
  }

  get companyRegistrationPhoto(): string {
    return this.editForm.get('companyRegistrationPhoto')?.value || null;
  }

  get distributorCertificatePhoto(): string {
    return this.editForm.get('distributorCertificatePhoto')?.value || null;
  }

  get name(): string {
    return this.editForm.get('name')?.value || null;
  }

  get officialStoreInd(): boolean {
    return this.editForm.get('officialStoreInd')?.value || false;
  }

  get selectedCategory(): ISupplierCategories {
    if (this.suppliercategories.length > 0 && this.editForm.get('supplierCategoryId')) {

      return this.suppliercategories.find(x => x.id === this.editForm.get('supplierCategoryId').value);
    }
  }

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    supplierReference: [],
    bankAccountName: [],
    bankAccountBranch: [],
    bankAccountCode: [],
    bankAccountNumber: [],
    bankInternationalCode: [],
    paymentDays: [],
    internalComments: [],
    phoneNumber: [null, [Validators.required]],
    emailAddress: [],
    nric: [],
    companyRegistrationNo: [],
    faxNumber: [],
    websiteUrl: [],
    webServiceUrl: [],
    creditRating: [],
    officialStoreInd: [],
    storeName: [],
    logo: [],
    nricFrontPhoto: [],
    nricBackPhoto: [],
    bankBookPhoto: [null, [Validators.required]],
    companyRegistrationPhoto: [],
    distributorCertificatePhoto: [],
    activeFlag: [null, [Validators.required]],
    validFrom: [null, [Validators.required]],
    validTo: [],
    supplierCategoryId: [],
    pickupAddressId: [],
    headOfficeAddressId: [],
    returnAddressId: [],
    contactPersonId: [],
    deliveryMethods: [],
    people: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected suppliersService: SuppliersService,
    protected supplierCategoriesService: SupplierCategoriesService,
    protected addressesService: AddressesService,
    protected deliveryMethodsService: DeliveryMethodsService,
    protected peopleService: PeopleService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ suppliers }) => {
      if (suppliers && !suppliers.id) {
        const today = moment().startOf('day');
        suppliers.validFrom = today;
        suppliers.validTo = today;
      }

      this.supplierCategoriesService
        .query()
        .subscribe((res: HttpResponse<ISupplierCategories[]>) => (this.suppliercategories = res.body || []));

      this.addressesService.query().subscribe((res: HttpResponse<IAddresses[]>) => (this.addresses = res.body || []));

      this.deliveryMethodsService.query().subscribe((res: HttpResponse<IDeliveryMethods[]>) => (this.deliverymethods = res.body || []));

      this.peopleService.query().subscribe((res: HttpResponse<IPeople[]>) => (this.people = res.body || []));
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const suppliers = this.createFromForm();
    console.log('suppliers', suppliers);
    this.subscribeToSaveResponse(this.suppliersService.create(suppliers));
  }

  private createFromForm(): ISuppliers {
    return {
      ...new Suppliers(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      supplierReference: this.editForm.get(['supplierReference'])!.value,
      bankAccountName: this.editForm.get(['bankAccountName'])!.value,
      bankAccountBranch: this.editForm.get(['bankAccountBranch'])!.value,
      bankAccountCode: this.editForm.get(['bankAccountCode'])!.value,
      bankAccountNumber: this.editForm.get(['bankAccountNumber'])!.value,
      bankInternationalCode: this.editForm.get(['bankInternationalCode'])!.value,
      paymentDays: this.editForm.get(['paymentDays'])!.value,
      internalComments: this.editForm.get(['internalComments'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      emailAddress: this.editForm.get(['emailAddress'])!.value,
      nric: this.editForm.get(['nric'])!.value,
      companyRegistrationNo: this.editForm.get(['companyRegistrationNo'])!.value,
      faxNumber: this.editForm.get(['faxNumber'])!.value,
      websiteUrl: this.editForm.get(['websiteUrl'])!.value,
      webServiceUrl: this.editForm.get(['webServiceUrl'])!.value,
      creditRating: this.editForm.get(['creditRating'])!.value,
      officialStoreInd: this.editForm.get(['officialStoreInd'])!.value,
      storeName: this.editForm.get(['storeName'])!.value,
      logo: this.editForm.get(['logo'])!.value,
      nricFrontPhoto: this.editForm.get(['nricFrontPhoto'])!.value,
      nricBackPhoto: this.editForm.get(['nricBackPhoto'])!.value,
      bankBookPhoto: this.editForm.get(['bankBookPhoto'])!.value,
      companyRegistrationPhoto: this.editForm.get(['companyRegistrationPhoto'])!.value,
      distributorCertificatePhoto: this.editForm.get(['distributorCertificatePhoto'])!.value,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      supplierCategoryId: this.editForm.get(['supplierCategoryId'])!.value,
      pickupAddressId: this.editForm.get(['pickupAddressId'])!.value,
      headOfficeAddressId: this.editForm.get(['headOfficeAddressId'])!.value,
      returnAddressId: this.editForm.get(['returnAddressId'])!.value,
      contactPersonId: this.editForm.get(['contactPersonId'])!.value,
      deliveryMethods: this.editForm.get(['deliveryMethods'])!.value,
      people: this.editForm.get(['people'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISuppliers>>): void {
    result.subscribe(
      (res) => this.onSaveSuccess(res.body),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(suppliers: ISuppliers): void {
    this.isSaving = false;
    // this.previousState();
    this.router.navigate(['/main/store/suppliers/view/', suppliers.id]);
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

  handleLogoChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ logo: info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  handleNricFrontChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ nricFrontPhoto: info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  handleNricBackChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ nricBackPhoto: info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  handleBankBookFirstPageChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ bankBookPhoto: info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  handleCompanyRegistrationPhotoChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ companyRegistrationPhoto: info.file.response.id });
        this.loading = false;
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

  handleDistributorCertificatePhotoChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.editForm.patchValue({ distributorCertificatePhoto: info.file.response.id });
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

/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PeopleService, PhotosService, SuppliersService, SupplierCategoriesService, AddressesService, DeliveryMethodsService, ImagesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { IPhotos, ISuppliers, Photos, Suppliers, ISupplierCategories, IAddresses, IDeliveryMethods, IPeople } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { HttpResponse } from '@angular/common/http';
import { Observable, Observer, Subject, of } from 'rxjs';
import { UploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
type SelectableEntity = ISupplierCategories | IAddresses | IDeliveryMethods | IPeople;

type SelectableManyToManyEntity = IDeliveryMethods | IPeople;

@Component({
  selector: 'app-supplier-view-edit',
  templateUrl: './supplier-view-edit.component.html',
  styleUrls: ['./supplier-view-edit.component.scss']
})
export class SupplierViewEditComponent implements OnInit {
  isSaving = false;
  suppliercategories: ISupplierCategories[] = [];
  addresses: IAddresses[] = [];
  deliverymethods: IDeliveryMethods[] = [];
  people: IPeople[] = [];
  loading = false;
  uploading = false;
  documentList: IPhotos[] = [];
  bannerList: IPhotos[] = [];
  suppliers: ISuppliers;
  previewImage: string | undefined = '';
  previewVisible = false;
  pickupAddressId: number;
  headOfficeAddressId: number;
  returnAddressId: number;

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
    protected photosService: PhotosService,
    protected imagesService: ImagesService,
    protected peopleService: PeopleService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ suppliers }) => {
      console.log(suppliers);
      if (suppliers?.id) {
        this.suppliers = suppliers;
        this.pickupAddressId = suppliers.pickupAddressId;
        this.headOfficeAddressId = suppliers.headOfficeAddressId;
        this.returnAddressId = suppliers.returnAddressId;

        this.updateForm(suppliers);
        this.loadDocumentList();
        this.loadBannerList();

        this.addressesService.query({ 'supplierId.equals': suppliers.id }).subscribe((res: HttpResponse<IAddresses[]>) => (this.addresses = res.body || []));
      }

      this.supplierCategoriesService
        .query()
        .subscribe((res: HttpResponse<ISupplierCategories[]>) => (this.suppliercategories = res.body || []));

      this.deliveryMethodsService.query().subscribe((res: HttpResponse<IDeliveryMethods[]>) => (this.deliverymethods = res.body || []));

      this.peopleService.query().subscribe((res: HttpResponse<IPeople[]>) => (this.people = res.body || []));
    });
  }

  loadDocumentList() {
    this.photosService.query({
      'supplierDocumentId.equals': this.suppliers.id
    }).subscribe((res: HttpResponse<IPhotos[]>) => (this.documentList = res.body || []));
  }

  loadBannerList() {
    this.photosService.query({
      'supplierBannerId.equals': this.suppliers.id
    }).subscribe((res: HttpResponse<IPhotos[]>) => {
      console.log('bannerlist', res.body)
      this.bannerList = res.body || [];
    });
  }

  updateForm(suppliers: ISuppliers): void {
    this.editForm.patchValue({
      id: suppliers.id,
      name: suppliers.name,
      supplierReference: suppliers.supplierReference,
      bankAccountName: suppliers.bankAccountName,
      bankAccountBranch: suppliers.bankAccountBranch,
      bankAccountCode: suppliers.bankAccountCode,
      bankAccountNumber: suppliers.bankAccountNumber,
      bankInternationalCode: suppliers.bankInternationalCode,
      paymentDays: suppliers.paymentDays,
      internalComments: suppliers.internalComments,
      phoneNumber: suppliers.phoneNumber,
      emailAddress: suppliers.emailAddress,
      nric: suppliers.nric,
      companyRegistrationNo: suppliers.companyRegistrationNo,
      faxNumber: suppliers.faxNumber,
      websiteUrl: suppliers.websiteUrl,
      webServiceUrl: suppliers.webServiceUrl,
      creditRating: suppliers.creditRating,
      officialStoreInd: suppliers.officialStoreInd,
      storeName: suppliers.storeName,
      logo: suppliers.logo,
      nricFrontPhoto: suppliers.nricFrontPhoto,
      nricBackPhoto: suppliers.nricBackPhoto,
      bankBookPhoto: suppliers.bankBookPhoto,
      companyRegistrationPhoto: suppliers.companyRegistrationPhoto,
      distributorCertificatePhoto: suppliers.distributorCertificatePhoto,
      activeFlag: suppliers.activeFlag,
      validFrom: suppliers.validFrom ? suppliers.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: suppliers.validTo ? suppliers.validTo.format(DATE_TIME_FORMAT) : null,
      supplierCategoryId: suppliers.supplierCategoryId,
      pickupAddressId: suppliers.pickupAddressId,
      headOfficeAddressId: suppliers.headOfficeAddressId,
      returnAddressId: suppliers.returnAddressId,
      contactPersonId: suppliers.contactPersonId,
      deliveryMethods: suppliers.deliveryMethods,
      people: suppliers.people,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const suppliers = this.createFromForm();
    this.subscribeToSaveResponse(this.suppliersService.update(suppliers));
  }

  saveAddress(): void {
    const suppliers = this.createFromForm();
    this.suppliersService.update(suppliers).subscribe((res) => this.msg.success('Save Addresses Sucessfully'));

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

  handleDocumentListChange(info): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        const photos: IPhotos = new Photos();
        photos.thumbUrl = `${this.blobUrl}${info.file.response.thumbUrl}`;
        photos.url = `${this.blobUrl}${info.file.response.url}`;
        photos.type = info.file.type;
        photos.uid = info.file.response.id;
        photos.size = info.file.size;
        photos.name = info.file.name;
        photos.fileName = info.file.name;
        photos.status = info.file.status;
        photos.percent = info.file.percent;
        photos.activeFlag = true;
        photos.lastModified = info.file.lastModified;
        photos.lastModifiedDate = moment(info.file.lastModifiedDate);
        photos.blobId = info.file.response.id;
        photos.supplierDocumentId = this.suppliers.id;

        this.saveDocumentPhoto(photos);
        break;
      case 'error':
        this.msg.error('Network error');
        break;
    }
  }

  saveDocumentPhoto(photos: IPhotos): void {
    this.photosService.create(photos).subscribe(() => {
      this.loadDocumentList();
    });
  }

  handleBannerListChange(info): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        const photos: IPhotos = new Photos();
        photos.thumbUrl = `${this.blobUrl}${info.file.response.thumbUrl}`;
        photos.url = `${this.blobUrl}${info.file.response.url}`;
        photos.type = info.file.type;
        photos.uid = info.file.response.id;
        photos.size = info.file.size;
        photos.name = info.file.name;
        photos.fileName = info.file.name;
        photos.status = info.file.status;
        photos.percent = info.file.percent;
        photos.activeFlag = true;
        photos.lastModified = info.file.lastModified;
        photos.lastModifiedDate = moment(info.file.lastModifiedDate);
        photos.blobId = info.file.response.id;
        photos.supplierBannerId = this.suppliers.id;
        this.saveBannerPhoto(photos);
        break;
      case 'error':
        this.msg.error('Network error');
        break;
    }
  }

  saveBannerPhoto(photos: IPhotos): void {
    this.photosService.create(photos).subscribe(() => {
      this.loadBannerList();
    });
  }

  pickupAddressChanged(event): void {
    this.editForm.patchValue({ pickupAddressId: event });
  }

  headOfficeAddressChanged(event): void {
    this.editForm.patchValue({ headOfficeAddressId: event });
  }

  returnAddressChanged(event): void {
    this.editForm.patchValue({ returnAddressId: event });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

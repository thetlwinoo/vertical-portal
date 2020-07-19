/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressesService, RegionsService, AddressTypesService, CustomersService, SuppliersService, CountriesService, CitiesService, TownshipsService, TownsService } from '@vertical/services';
import { ActivatedRoute, Router } from '@angular/router';
import { IAddresses, Addresses, ISuppliers, IRegions, IAddressTypes, ICustomers, ICountries, ICities, ITownships, ITowns } from '@vertical/models';
import * as moment from 'moment';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { HttpResponse } from '@angular/common/http';
import { Observable, Observer, Subject, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _ from 'lodash';
import { map, takeUntil, filter } from 'rxjs/operators';

type SelectableEntity = IRegions | IAddressTypes | ICustomers | ISuppliers;

@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.scss']
})
export class AddressAddComponent implements OnInit, OnDestroy {
  isSaving = false;
  regions: IRegions[] = [];
  addresstypes: IAddressTypes[] = [];
  customers: ICustomers[] = [];
  suppliers: ISuppliers[] = [];
  countries: ICountries[] = [];
  cities: ICities[] = [];
  townships: ITownships[] = [];
  towns: ITowns[] = [];

  get cityId(): number {
    return this.editForm.get('cityId')?.value || null;
  }

  get city(): ICities {
    return this.cities.find(x => x.id === this.editForm.get('cityId')?.value) || null;
  }

  get regionId(): number {
    return this.editForm.get('regionId')?.value || null;
  }

  get region(): IRegions {
    return this.regions.find(x => x.id === this.editForm.get('regionId')?.value) || null;
  }

  get townshipId(): number {
    return this.editForm.get('townshipId')?.value || null;
  }

  get township(): ITownships {
    return this.townships.find(x => x.id === this.editForm.get('townshipId')?.value) || null;
  }

  get town(): ITownships {
    return this.towns.find(x => x.id === this.editForm.get('townId')?.value) || null;
  }

  editForm = this.fb.group({
    id: [],
    contactPerson: [],
    contactNumber: [],
    contactEmailAddress: [null, [Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')]],
    addressLine1: [null, [Validators.required]],
    addressLine2: [],
    postalCode: [],
    description: [],
    validFrom: [null, [Validators.required]],
    validTo: [],
    regionId: [],
    cityId: [],
    townshipId: [],
    townId: [],
    addressTypeId: [],
    customerAddressId: [],
    supplierAddressId: [],
  });

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected addressesService: AddressesService,
    protected regionsService: RegionsService,
    protected addressTypesService: AddressTypesService,
    protected customersService: CustomersService,
    protected suppliersService: SuppliersService,
    protected countriesService: CountriesService,
    protected citiesService: CitiesService,
    protected townshipsService: TownshipsService,
    protected townsService: TownsService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(params => params.supplierId),
        map(params => (this.editForm.patchValue({ supplierAddressId: params.supplierId })))
      )
      .subscribe();      
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ addresses }) => {
      if (!addresses.id) {
        const today = moment().startOf('day');
        addresses.validFrom = today;
        addresses.validTo = today;
      }

      this.regionsService.query().subscribe((res: HttpResponse<IRegions[]>) => (this.regions = res.body || []));

      this.addressTypesService.query().subscribe((res: HttpResponse<IAddressTypes[]>) => (this.addresstypes = res.body || []));

      this.customersService.query().subscribe((res: HttpResponse<ICustomers[]>) => (this.customers = res.body || []));

      this.suppliersService.query().subscribe((res: HttpResponse<ISuppliers[]>) => (this.suppliers = res.body || []));
    });
  }

  selectCity(cityId: number): void {
    this.townshipsService.query({ 'cityId.equals': cityId }).subscribe((res: HttpResponse<ITownships[]>) => (this.townships = res.body || []));
  }

  selectRegion(regionId: number): void {
    this.citiesService.query({ 'regionId.equals': regionId }).subscribe((res: HttpResponse<ICities[]>) => (this.cities = res.body || []));
  }

  selectTownship(townshipId: number): void {
    this.townsService.query({ 'townshipId.equals': townshipId }).subscribe((res: HttpResponse<ITowns[]>) => (this.towns = res.body || []));
  }

  selectTown(town: ITowns) {
    console.log('Town', town);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const addresses = this.createFromForm();
    console.log('addresses', addresses)
    this.subscribeToSaveResponse(this.addressesService.create(addresses));
  }

  private createFromForm(): IAddresses {
    return {
      ...new Addresses(),
      id: this.editForm.get(['id'])!.value,
      contactPerson: this.editForm.get(['contactPerson'])!.value,
      contactNumber: this.editForm.get(['contactNumber'])!.value,
      contactEmailAddress: this.editForm.get(['contactEmailAddress'])!.value,
      addressLine1: this.editForm.get(['addressLine1'])!.value,
      addressLine2: this.editForm.get(['addressLine2'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      description: this.editForm.get(['description'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : undefined,
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      regionId: this.editForm.get(['regionId'])!.value,
      cityId: this.editForm.get(['cityId'])!.value,
      townshipId: this.editForm.get(['townshipId'])!.value,
      townId: this.editForm.get(['townId'])!.value,
      addressTypeId: this.editForm.get(['addressTypeId'])!.value,
      customerAddressId: this.editForm.get(['customerAddressId'])!.value,
      supplierAddressId: this.editForm.get(['supplierAddressId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddresses>>): void {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

import { Component, OnInit } from '@angular/core';
import { ITownships, IDeliveryMethods, IRegions, ICities, IShippingFeeChart, ShippingFeeChart } from '@vertical/models';
import { Validators, FormBuilder, FormArray } from '@angular/forms';
import { TownshipsService, DeliveryMethodsService, ShippingFeeChartService, RegionsService, CitiesService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from '@vertical/constants';
import { NzMessageService } from 'ng-zorro-antd/message';

type SelectableEntity = ITownships | IDeliveryMethods;

@Component({
  selector: 'app-shipping-fee-chart',
  templateUrl: './shipping-fee-chart.component.html',
  styleUrls: ['./shipping-fee-chart.component.scss']
})
export class ShippingFeeChartComponent implements OnInit {
  deliverymethods: IDeliveryMethods[] = [];
  regions: IRegions[] = [];
  deliveryMethodId: number;
  sizeOfPercel: string[] = ['S', 'M', 'L', 'XL'];

  sourceTownships: ITownships[] = [];
  sourceCities: ICities[] = [];
  sourceRegionId: number;
  sourceCityId: number;
  sourceTownshipId: number;

  destinationTownships: ITownships[] = [];
  destinationCities: ICities[] = [];
  destinationRegionId: number;
  destinationCityId: number;
  destinationTownshipId: number;

  editForm = this.fb.group({
    id: [],
    feeChartList: this.fb.array([]),
    sourceTownshipId: [],
    destinationTownshipId: [],
    deliveryMethodId: [],
  });

  // editCache: { [key: string]: { edit: boolean; data: IShippingFeeChart } } = {};
  // listOfData: IShippingFeeChart[] = [];

  get shippingFeeChartForm(): FormArray {
    if (this.editForm) {
      return this.editForm.get('feeChartList') as FormArray;
    }
  }

  constructor(
    protected shippingFeeChartService: ShippingFeeChartService,
    protected regionsService: RegionsService,
    protected citiesService: CitiesService,
    protected townshipsService: TownshipsService,
    protected deliveryMethodsService: DeliveryMethodsService,
    protected activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) {

    this.regionsService.query().subscribe((res: HttpResponse<IRegions[]>) => {
      this.regions = res.body || [];
      this.sourceRegionId = this.regions.find(x => x.name === 'Yangon').id;
      this.destinationRegionId = this.regions.find(x => x.name === 'Yangon').id;

      this.selectRegion(this.sourceRegionId, true);
      this.selectRegion(this.destinationRegionId, false);
    });

    this.deliveryMethodsService.query().subscribe((res: HttpResponse<IDeliveryMethods[]>) => {
      this.deliverymethods = res.body || [];
      this.deliveryMethodId = this.deliverymethods.find(x => x.name === 'Standard').id;
    });
  }

  ngOnInit(): void {
  }

  loadShippingFeeChart(): void {
    this.shippingFeeChartService.query({
      'sourceTownshipId.equals': this.sourceTownshipId,
      'destinationTownshipId.equals': this.destinationTownshipId,
      'deliveryMethodId.equals': this.deliveryMethodId
    }).subscribe((res) => {
      const data = res.body || [];
      console.log('chart', data);
      this.createFormArray(data);
    });
  }

  selectCity(cityId: number, sourceInd: boolean): void {
    this.townshipsService.query({ 'cityId.equals': cityId })
      .subscribe((res: HttpResponse<ITownships[]>) => {
        if (sourceInd) {
          this.sourceTownships = res.body || [];
        } else {
          this.destinationTownships = res.body || [];
        }
      });
  }

  selectRegion(regionId: number, sourceInd: boolean): void {
    this.citiesService.query({ 'regionId.equals': regionId })
      .subscribe((res: HttpResponse<ICities[]>) => {
        if (sourceInd) {
          this.sourceCities = res.body || [];
        } else {
          this.destinationCities = res.body || [];
        }
      });
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  createFormArray(itemList: IShippingFeeChart[]): void {

    const arrayForm = this.editForm.get('feeChartList') as FormArray;
    arrayForm.clear();

    if (itemList.length <= 0) {
      // const arrayForm = this.fb.array([]);
      this.sizeOfPercel.map(item => {
        arrayForm.push(this.fb.group(this.createNewShippingFeeChart(item)));
      });
    } else {
      itemList.map(item => {
        arrayForm.push(this.fb.group(item));
      });
    }
  }

  private createNewShippingFeeChart(percelSize): IShippingFeeChart {
    let minVolWeight = 0;
    let maxVolWeight = 0;
    let minActWeight = 0;
    let maxActWeight = 0;
    const today = moment().startOf('day');

    switch (percelSize) {
      case 'S':
        minVolWeight = 0;
        maxVolWeight = 80;
        minActWeight = 0;
        maxActWeight = 5;
        break;
      case 'M':
        minVolWeight = 81;
        maxVolWeight = 120;
        minActWeight = 5;
        maxActWeight = 10;
        break;
      case 'L':
        minVolWeight = 121;
        maxVolWeight = 200;
        minActWeight = 10;
        maxActWeight = 20;
        break;
      case 'XL':
        minVolWeight = 201;
        maxVolWeight = 300;
        minActWeight = 20;
        maxActWeight = 30;
        break;
    }

    return {
      ...new ShippingFeeChart(),
      sizeOfPercel: percelSize,
      lastEditedBy: 'SYSTEM',
      lastEditedWhen: today,
      sourceTownshipId: this.sourceTownshipId,
      destinationTownshipId: this.destinationTownshipId,
      deliveryMethodId: this.deliveryMethodId,
      minVolumeWeight: minVolWeight,
      maxVolumeWeight: maxVolWeight,
      minActualWeight: minActWeight,
      maxActualWeight: maxActWeight,
    };
  }

  public save() {
    const formArray = (this.shippingFeeChartForm as FormArray).getRawValue();
    console.log('formArray', formArray)
    let saveCount = 0;
    formArray.map(item => {
      if (item.id) {
        this.shippingFeeChartService.update(item).subscribe(res => {
          saveCount += 1;

          if (saveCount === formArray.length) {
            this.msg.success('Data has been sucessfully created');
            this.loadShippingFeeChart();
          }
        });
      }
      else {
        this.shippingFeeChartService.create(item).subscribe(res => {
          saveCount += 1;

          if (saveCount === formArray.length) {
            this.msg.success('Data has been sucessfully updated');
            this.loadShippingFeeChart();
          }
        });
      }
    });
  }
  // startEdit(id: number): void {
  //   this.editCache[id].edit = true;
  // }

  // cancelEdit(id: number): void {
  //   const index = this.listOfData.findIndex(item => item.id === id);
  //   this.editCache[id] = {
  //     data: { ...this.listOfData[index] },
  //     edit: false
  //   };
  // }

  // saveEdit(id: number): void {
  //   const index = this.listOfData.findIndex(item => item.id === id);
  //   Object.assign(this.listOfData[index], this.editCache[id].data);
  //   this.editCache[id].edit = false;
  // }

  // updateEditCache(): void {
  //   this.listOfData.forEach(item => {
  //     this.editCache[item.id] = {
  //       edit: false,
  //       data: { ...item }
  //     };
  //   });
  // }
}

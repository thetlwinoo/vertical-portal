import { Component, OnInit, OnDestroy } from '@angular/core';
import { IProductOptionSet, IProductOption, ProductOptionSet, ProductOption, ISuppliers } from '@vertical/models';
import { Subscription, Observable } from 'rxjs';
import { ProductOptionSetService, ProductOptionService } from '@vertical/services';
import { JhiEventManager } from 'ng-jhipster';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import * as fromAuth from 'app/ngrx/auth/reducers';

enum Mode {
  edit,
  add,
  view
}

type SelectableEntity = IProductOptionSet | IProductOption;

@Component({
  selector: 'app-product-options',
  templateUrl: './product-options.component.html',
  styleUrls: ['./product-options.component.scss']
})
export class ProductOptionsComponent implements OnInit, OnDestroy {
  productOptionSets?: IProductOptionSet[] = [];
  editOptionSetCache: { [key: string]: { mode: Mode; data: IProductOptionSet } } = {};
  selectedOptionSet: IProductOptionSet;

  productOptions?: IProductOption[] = [];
  editOptionCache: { [key: string]: { mode: Mode; data: IProductOption } } = {};
  selectedOption: IProductOption;

  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;

  eventSubscriber?: Subscription;
  mode = Mode;

  constructor(
    protected productOptionSetService: ProductOptionSetService,
    protected productOptionService: ProductOptionService,
    protected eventManager: JhiEventManager,
    private modal: NzModalService,
    private authStore: Store<fromAuth.State>,
  ) {
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.loadOptionSetAll();
    this.registerChangeInProductOptionSets();

    this.loadOptionAll();
    this.registerChangeInProductOptions();

    this.selectedSupplier$.subscribe(selectedSupplier => {
      this.selectedSupplier = selectedSupplier;
    });
  }

  // Product Options
  loadOptionSetAll(): void {
    this.productOptionSetService
      .query()
      .subscribe((res: HttpResponse<IProductOptionSet[]>) => {
        this.productOptionSets = res.body || [];
        console.log('this.productOptionSets', this.productOptionSets)
        this.editOptionSetCache = {};
        this.updateOptionSetEditCache();
      });
  }

  startOptionSetEdit(id: string): void {
    this.editOptionSetCache[id].mode = Mode.edit;
  }

  cancelOptionSetEdit(id: number): void {
    if (!id) {
      this.productOptionSets = this.productOptionSets.filter(d => d.id !== id);
    } else {
      const index = this.productOptionSets.findIndex(item => item.id === id);
      this.editOptionSetCache[id] = {
        data: { ...this.productOptionSets[index] },
        mode: Mode.view
      };
    }
  }

  saveOptionSetEdit(id: number): void {
    if (id) {
      this.productOptionSetService.update(this.editOptionSetCache[id].data).subscribe(() => {
        this.eventManager.broadcast('productOptionSetListModification');
      });
    } else {
      this.productOptionSetService.create(this.editOptionSetCache[id].data).subscribe(() => {
        this.eventManager.broadcast('productOptionSetListModification');
      });
    }
  }

  updateOptionSetEditCache(): void {
    this.productOptionSets?.forEach(item => {
      this.editOptionSetCache[item.id] = {
        mode: Mode.view,
        data: { ...item }
      };
    });
  }

  addOptionSetRow(): void {
    this.productOptionSets = [
      ...this.productOptionSets,
      new ProductOptionSet()
    ];

    this.productOptionSets?.forEach(item => {
      if (!item.id) {
        this.editOptionSetCache[item.id] = {
          mode: Mode.add,
          data: { ...item }
        };
      }
    });
  }

  selectedOptionSetRow(data: IProductOptionSet) {
    this.selectedOptionSet = data;
    this.eventManager.broadcast('productOptionListModification');
  }

  registerChangeInProductOptionSets(): void {
    this.eventSubscriber = this.eventManager.subscribe('productOptionSetListModification', () => this.loadOptionSetAll());
  }

  deleteOptionSet(id: number): void {
    this.productOptionSetService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productOptionSetListModification');
    });
  }

  // End Product Options

  // Options
  loadOptionAll(): void {
    if (this.selectedOptionSet?.id) {
      this.productOptionService
        .query({ 'productOptionSetId.equals': this.selectedOptionSet?.id, 'supplierId.equals': this.selectedSupplier?.id })
        .subscribe((res: HttpResponse<IProductOption[]>) => {
          this.productOptions = res.body || [];
          this.editOptionCache = {};
          this.updateOptionEditCache();
        });
    }
  }

  startOptionEdit(id: string): void {
    this.editOptionCache[id].mode = Mode.edit;
  }

  cancelOptionEdit(id: number): void {
    if (!id) {
      this.productOptions = this.productOptions.filter(d => d.id !== id);
    } else {
      const index = this.productOptions.findIndex(item => item.id === id);
      this.editOptionCache[id] = {
        data: { ...this.productOptions[index] },
        mode: Mode.view
      };
    }
  }

  saveOptionEdit(id: number): void {
    const option = this.editOptionCache[id].data;
    option.productOptionSetId = this.selectedOptionSet.id;
    option.supplierId = this.selectedSupplier.id;

    if (id) {
      this.productOptionService.update(option).subscribe(() => {
        this.eventManager.broadcast('productOptionListModification');
      });
    } else {
      this.productOptionService.create(option).subscribe(() => {
        this.eventManager.broadcast('productOptionListModification');
      });
    }
  }

  updateOptionEditCache(): void {
    this.productOptions?.forEach(item => {
      this.editOptionCache[item.id] = {
        mode: Mode.view,
        data: { ...item }
      };
    });
  }

  addOptionRow(): void {

    console.log('this.productOptions', this.productOptions)

    this.productOptions = [
      ...this.productOptions,
      new ProductOption()
    ];

    console.log('this.productOptions', this.productOptions)

    this.productOptions?.forEach(item => {
      if (!item.id) {
        this.editOptionCache[item.id] = {
          mode: Mode.add,
          data: { ...item }
        };
      }
    });
  }

  selectedOptionRow(data: IProductOption) {
    this.selectedOption = data;
  }

  registerChangeInProductOptions(): void {
    this.eventSubscriber = this.eventManager.subscribe('productOptionListModification', () => this.loadOptionAll());
  }

  deleteOption(id: number): void {
    this.productOptionService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productOptionListModification');
    });
  }

  // End Options

  trackId(index: number, item: SelectableEntity): number {
    // tslint:disable-next-line: no-non-null-assertion
    return item.id!;
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }
}

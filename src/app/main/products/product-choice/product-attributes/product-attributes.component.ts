import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IProductAttributeSet, ProductAttributeSet, IProductAttribute, ProductAttribute, ISuppliers } from '@vertical/models';
import { Subscription, Observable } from 'rxjs';
import { ProductAttributeSetService, ProductAttributeService } from '@vertical/services';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { select, Store } from '@ngrx/store';
import * as fromAuth from 'app/ngrx/auth/reducers';

enum Mode {
  edit,
  add,
  view
}

type SelectableEntity = IProductAttributeSet | IProductAttribute;

@Component({
  selector: 'app-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.scss']
})
export class ProductAttributesComponent implements OnInit, OnDestroy {
  productAttributeSets?: IProductAttributeSet[] = [];
  editAttributeSetCache: { [key: string]: { mode: Mode; data: IProductAttributeSet } } = {};
  selectedAttributeSet: IProductAttributeSet;

  productAttributes?: IProductAttribute[] = [];
  editAttributeCache: { [key: string]: { mode: Mode; data: IProductAttribute } } = {};
  selectedAttribute: IProductAttribute;

  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;

  eventSubscriber?: Subscription;
  mode = Mode;

  constructor(
    protected productAttributeSetService: ProductAttributeSetService,
    protected productAttributeService: ProductAttributeService,
    protected eventManager: JhiEventManager,
    private modal: NzModalService,
    private authStore: Store<fromAuth.State>,
  ) {
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.loadAttributeSetAll();
    this.registerChangeInProductAttributeSets();

    this.loadAttributeAll();
    this.registerChangeInProductAttributes();

    this.selectedSupplier$.subscribe(selectedSupplier => {
      this.selectedSupplier = selectedSupplier;
    });
  }

  // Attribute Set
  loadAttributeSetAll(): void {
    this.productAttributeSetService
      .query()
      .subscribe((res: HttpResponse<IProductAttributeSet[]>) => {
        this.productAttributeSets = res.body || [];
        this.editAttributeSetCache = {};
        this.updateAttributeSetEditCache();
      });
  }

  startAttributeSetEdit(id: string): void {
    this.editAttributeSetCache[id].mode = Mode.edit;
  }

  cancelAttributeSetEdit(id: number): void {
    if (!id) {
      this.productAttributeSets = this.productAttributeSets.filter(d => d.id !== id);
    } else {
      const index = this.productAttributeSets.findIndex(item => item.id === id);
      this.editAttributeSetCache[id] = {
        data: { ...this.productAttributeSets[index] },
        mode: Mode.view
      };
    }
  }

  saveAttributeSetEdit(id: number): void {
    if (id) {
      this.productAttributeSetService.update(this.editAttributeSetCache[id].data).subscribe(() => {
        this.eventManager.broadcast('productAttributeSetListModification');
      });
    } else {
      this.productAttributeSetService.create(this.editAttributeSetCache[id].data).subscribe(() => {
        this.eventManager.broadcast('productAttributeSetListModification');
      });
    }
  }

  updateAttributeSetEditCache(): void {
    this.productAttributeSets?.forEach(item => {
      this.editAttributeSetCache[item.id] = {
        mode: Mode.view,
        data: { ...item }
      };
    });
  }

  addAttributeSetRow(): void {
    this.productAttributeSets = [
      ...this.productAttributeSets,
      new ProductAttributeSet()
    ];

    this.productAttributeSets?.forEach(item => {
      if (!item.id) {
        this.editAttributeSetCache[item.id] = {
          mode: Mode.add,
          data: { ...item }
        };
      }
    });
  }

  selectedAttributeSetRow(data: IProductAttributeSet) {
    this.selectedAttributeSet = data;
    this.eventManager.broadcast('productAttributeListModification');
  }

  registerChangeInProductAttributeSets(): void {
    this.eventSubscriber = this.eventManager.subscribe('productAttributeSetListModification', () => this.loadAttributeSetAll());
  }

  deleteAttributeSet(id: number): void {
    this.productAttributeSetService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productAttributeSetListModification');
    });
  }

  // End Attribute Set

  // Attributes
  loadAttributeAll(): void {
    if (this.selectedAttributeSet?.id) {
      this.productAttributeService
        .query({ 'productAttributeSetId.equals': this.selectedAttributeSet?.id, 'supplierId.equals': this.selectedSupplier?.id })
        .subscribe((res: HttpResponse<IProductAttribute[]>) => {
          this.productAttributes = res.body || [];
          this.editAttributeCache = {};
          this.updateAttributeEditCache();
        });
    }
  }

  startAttributeEdit(id: string): void {
    this.editAttributeCache[id].mode = Mode.edit;
  }

  cancelAttributeEdit(id: number): void {
    if (!id) {
      this.productAttributes = this.productAttributes.filter(d => d.id !== id);
    } else {
      const index = this.productAttributes.findIndex(item => item.id === id);
      this.editAttributeCache[id] = {
        data: { ...this.productAttributes[index] },
        mode: Mode.view
      };
    }
  }

  saveAttributeEdit(id: number): void {
    const attribute = this.editAttributeCache[id].data;
    attribute.productAttributeSetId = this.selectedAttributeSet.id;
    attribute.supplierId = this.selectedSupplier.id;

    if (id) {
      this.productAttributeService.update(attribute).subscribe(() => {
        this.eventManager.broadcast('productAttributeListModification');
      });
    } else {
      this.productAttributeService.create(attribute).subscribe(() => {
        this.eventManager.broadcast('productAttributeListModification');
      });
    }
  }

  updateAttributeEditCache(): void {
    this.productAttributes?.forEach(item => {
      this.editAttributeCache[item.id] = {
        mode: Mode.view,
        data: { ...item }
      };
    });
  }

  addAttributeRow(): void {
    this.productAttributes = [
      ...this.productAttributes,
      new ProductAttribute()
    ];

    this.productAttributes?.forEach(item => {
      if (!item.id) {
        this.editAttributeCache[item.id] = {
          mode: Mode.add,
          data: { ...item }
        };
      }
    });
  }

  selectedAttributeRow(data: IProductAttribute) {
    this.selectedAttribute = data;
  }

  registerChangeInProductAttributes(): void {
    this.eventSubscriber = this.eventManager.subscribe('productAttributeListModification', () => this.loadAttributeAll());
  }

  deleteAttribute(id: number): void {
    this.productAttributeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('productAttributeListModification');
    });
  }

  // End Attributes

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

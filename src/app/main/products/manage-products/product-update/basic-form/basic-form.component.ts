import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IProductBrand, IProductCategory, ISuppliers } from '@vertical/models';
import { Subject, Observable } from 'rxjs';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { ProductBrandService } from '@vertical/services';
import { HttpResponse } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { FetchActions } from 'app/ngrx/products/actions';
import * as fromProducts from 'app/ngrx/products/reducers';
import * as fromAuth from 'app/ngrx/auth/reducers';

type SelectableEntity = IProductCategory | IProductBrand;

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() editForm: FormGroup;
  @Input() categories: IProductCategory[];

  productbrands: IProductBrand[] = [];
  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected productBrandService: ProductBrandService,
    private store: Store<fromProducts.State>,
    private authStore: Store<fromAuth.State>,
  ) {
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.productBrandService.query().subscribe((res: HttpResponse<IProductBrand[]>) => (this.productbrands = res.body || []));

    this.selectedSupplier$.subscribe(supplier => {
      this.selectedSupplier = supplier;
    });
  }

  ngOnChanges(): void {
    // if (this.editForm) {
    //   console.log('basic form ', this.editForm.getRawValue());
    // }
  }
  onSelectionChange(selectedOptions: NzCascaderOption[]): void {
    const leaf = selectedOptions.find(o => o.isLeaf === true);
    this.editForm.patchValue({ productCategoryId: leaf.id });
    this.store.dispatch(FetchActions.fetchProductChoice({ prop: { id: leaf.id, supplierId: this.selectedSupplier.id } }));
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

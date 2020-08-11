/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IProductCategory, IProductAttributeSet, IProductOptionSet, IProductChoice, ProductChoice } from '@vertical/models';
import { ProductChoiceService, ProductCategoryService, ProductAttributeSetService, ProductOptionSetService } from '@vertical/services';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromProducts from 'app/ngrx/products/reducers';
import { FetchActions } from 'app/ngrx/products/actions';
import { takeUntil } from 'rxjs/operators';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { CommonUtils } from '@vertical/utils/common.utils';

type SelectableEntity = IProductCategory | IProductAttributeSet | IProductOptionSet;

@Component({
  selector: 'app-product-choice-view-edit',
  templateUrl: './product-choice-view-edit.component.html',
  styleUrls: ['./product-choice-view-edit.component.scss']
})
export class ProductChoiceViewEditComponent implements OnInit, OnDestroy {

  isSaving = false;
  // productcategories: IProductCategory[] = [];
  productattributesets: IProductAttributeSet[] = [];
  productoptionsets: IProductOptionSet[] = [];
  categories$: Observable<IProductCategory[]>;
  categories: IProductCategory[];

  editForm = this.fb.group({
    id: [],
    isMultiply: [null, [Validators.required]],
    productCategoryId: [],
    productCategoryCascade: [],
    productAttributeSetId: [],
    productOptionSetId: [],
  });

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected productChoiceService: ProductChoiceService,
    protected productCategoryService: ProductCategoryService,
    protected productAttributeSetService: ProductAttributeSetService,
    protected productOptionSetService: ProductOptionSetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<fromProducts.State>,
  ) {
    this.categories$ = store.pipe(select(fromProducts.getFetchCategoriesTree));
  }

  ngOnInit(): void {
    this.store.dispatch(FetchActions.fetchCategories());

    this.activatedRoute.data.subscribe(({ productChoice }) => {
      this.categories$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.categories = data;
        this.updateForm(productChoice);
      });
      // this.productCategoryService.query().subscribe((res: HttpResponse<IProductCategory[]>) => (this.productcategories = res.body || []));

      this.productAttributeSetService
        .query()
        .subscribe((res: HttpResponse<IProductAttributeSet[]>) => (this.productattributesets = res.body || []));

      this.productOptionSetService.query().subscribe((res: HttpResponse<IProductOptionSet[]>) => (this.productoptionsets = res.body || []));
    });
  }

  updateForm(productChoice: IProductChoice): void {
    this.editForm.patchValue({
      id: productChoice.id,
      isMultiply: productChoice.isMultiply,
      productCategoryId: productChoice.productCategoryId,
      productCategoryCascade: this.getProductCategoryCascade(productChoice.productCategoryId),
      productAttributeSetId: productChoice.productAttributeSetId,
      productOptionSetId: productChoice.productOptionSetId,
    });
  }

  getProductCategoryCascade(id: number): number[] {
    const category = CommonUtils.findById(this.categories, id);
    return category?.parentCascade.split(',').map(x => +x);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productChoice = this.createFromForm();
    if (productChoice.id) {
      this.subscribeToSaveResponse(this.productChoiceService.update(productChoice));
    } else {
      this.subscribeToSaveResponse(this.productChoiceService.create(productChoice));
    }
  }

  private createFromForm(): IProductChoice {
    return {
      ...new ProductChoice(),
      id: this.editForm.get(['id'])!.value,
      isMultiply: this.editForm.get(['isMultiply'])!.value,
      productCategoryId: this.editForm.get(['productCategoryId'])!.value,
      productAttributeSetId: this.editForm.get(['productAttributeSetId'])!.value,
      productOptionSetId: this.editForm.get(['productOptionSetId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductChoice>>): void {
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

  onSelectionChange(selectedOptions: NzCascaderOption[]): void {
    const leaf = selectedOptions.find(o => o.isLeaf === true);
    this.editForm.patchValue({ productCategoryId: leaf.id })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

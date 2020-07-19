import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IProducts, IProductCategory, Products, IProductModel, ISuppliers, IProductBrand, IWarrantyTypes } from '@vertical/models';
import { locale as english } from '../i18n/en';
import { locale as myanmar } from '../i18n/mm';
import { vsAnimations } from '@vertical/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromProducts from 'app/ngrx/products/reducers';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { FetchActions, CategoryActions } from 'app/ngrx/products/actions';
import { TranslationLoaderService } from '@vertical/services';

@Component({
  selector: 'basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: vsAnimations,
})
export class BasicFormComponent implements OnInit, OnDestroy {
  @Input() productsForm: FormGroup;
  @Input() products: IProducts;

  productcategories: IProductCategory[];
  pageType: string;
  dialogRef: any;
  hasSelectedCategory: boolean;
  showModel = false;

  productModels$: Observable<IProductModel[]>;
  public productModelsFiltered;
  categories$: Observable<any[]>;
  categories: any[];
  productBrands$: Observable<IProductBrand[]>;

  // supplier$: Observable<ISuppliers>;
  selectedNode: any;
  selectedText: string;

  public parsedData: any[];
  public searchTerm = '';
  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private translationLoaderService: TranslationLoaderService,
    private store: Store<fromProducts.State>,
    private authStore: Store<fromAuth.State>
  ) {
    // this.productModels$ = store.pipe(select(fromProducts.getFetchModels));
    this.productBrands$ = store.pipe(select(fromProducts.getFetchBrands));
    // this.supplier$ = this.authStore.pipe(select(fromAuth.getSupplierFetched));
    this.categories$ = store.pipe(select(fromProducts.getFetchCategoriesTree));
    // this.productModels$.subscribe(models => (this.productModelsFiltered = models.slice()));
  }

  ngOnInit(): void {
    // this.supplier$.pipe(takeUntil(this.unsubscribe$)).subscribe(supplier => {
    //   console.log('supplier', supplier);
    //   if (supplier) {
    //     this.store.dispatch(FetchActions.fetchBrands({ id: supplier.id }));
    //     this.store.dispatch(FetchActions.fetchWarrantyType());
    //   }
    // });
    this.translationLoaderService.loadTranslations(english, myanmar);
    this.categories$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log(this.categories);
      this.parsedData = data;
      this.categories = data;
    });
  }

  selectCategory(event): void {
    this.store.dispatch(CategoryActions.selectCategory({ id: this.selectedNode.data.id }));
    this.showModel = false;
    this.products.stockItemLists = [];
    this.productsForm.patchValue({
      productCategoryId: this.selectedNode.data.id,
      productCategoryName: this.selectedNode.data.name,
      productCategoryLabel: this.selectedText,
      // productCategory: this.selectedNode.data,
      productAttribute: null,
      productOption: null,
    });
    // this.products.resetChoice();
  }

  nodeSelect(event): void {
    this.selectedNode = event;
    this.selectedText = event.data.parentName ? event.data.parentName + ' / ' + event.label : event.label;
  }

  compareObjects(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  public onkeyup(value: string): void {
    this.parsedData = this.search(this.categories, value);
  }

  public search(items: any[], term: string): any[] {
    return items.reduce((acc, item) => {
      if (this.contains(item.label, term)) {
        acc.push(item);
      } else if (item.children && item.children.length > 0) {
        const newItems = this.search(item.children, term);

        if (newItems.length > 0) {
          acc.push({
            label: item.label,
            data: item.data,
            expandedIcon: item.expandedIcon,
            collapsedIcon: item.collapsedIcon,
            childIcon: item.childIcon,
            expanded: true,
            type: item.type,
            children: newItems,
          });
        }
      }

      return acc;
    }, []);
  }

  public contains(text: string, term: string): boolean {
    return text.toLowerCase().includes(term.toLowerCase());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

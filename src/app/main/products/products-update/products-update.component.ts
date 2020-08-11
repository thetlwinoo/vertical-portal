import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslationLoaderService, ProductsService, ProductDocumentsService, StockItemsService } from '@vertical/services';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { vsAnimations } from '@vertical/animations';
import { RootUtils } from '@vertical/utils';

import {
  ISuppliers,
  Products,
  IProductCategory,
  IProductDocuments,
  IStockItems,
  IProductAttribute,
  IProductOption,
  StockItems,
} from '@vertical/models';

import { locale as english } from './i18n/en';
import { locale as myanmar } from './i18n/mm';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as fromProducts from 'app/ngrx/products/reducers';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { ProductActions, FetchActions } from 'app/ngrx/products/actions';

@Component({
  selector: 'products-update',
  templateUrl: './products-update.component.html',
  styleUrls: ['./products-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: vsAnimations,
})
export class ProductsUpdateComponent implements OnInit, OnDestroy {
  actionsSubscription: Subscription;
  products: Products;
  isSaving: boolean;
  pageType: string;
  productsForm: FormGroup;
  selectedTab = 0;
  supplier$: Observable<ISuppliers>;
  supplier: ISuppliers;
  stockItems$: Observable<IStockItems[]>;
  stockItems: IStockItems[];
  productDocument$: Observable<IProductDocuments>;
  productDocument: IProductDocuments;
  selectedCategory$: Observable<IProductCategory>;
  selectedCategory: IProductCategory;

  showImportCompleted = false;

  categoryId$: Observable<number>;
  categoryId: number;
  loadingForm = true;
  dangerousGoods: any;
  // Private
  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private store: Store<fromProducts.State>,
    private storeAuth: Store<fromAuth.State>,
    route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location,
    private translationLoaderService: TranslationLoaderService,
    protected activatedRoute: ActivatedRoute,
    protected productsService: ProductsService,
    protected productDocumentsService: ProductDocumentsService,
    protected stockItemsService: StockItemsService
  ) {
    // this.supplier$ = this.storeAuth.pipe(select(fromAuth.getSupplierFetched));
    // this.supplier$.pipe(takeUntil(this.unsubscribe$)).subscribe(supplier => (this.supplier = supplier));
    this.stockItems$ = this.store.pipe(select(fromProducts.getFetchStockItems));
    this.supplier$.pipe(takeUntil(this.unsubscribe$)).subscribe(supplier => (this.supplier = supplier));
    this.productDocument$ = this.store.pipe(select(fromProducts.getFetchProductDocument));
    this.selectedCategory$ = this.store.pipe(select(fromProducts.getSelectedCategory));

    this.actionsSubscription = route.params
      .pipe(map(params => ProductActions.selectProduct({ id: params.id })))
      .subscribe(action => store.dispatch(action));
  }

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.pipe(takeUntil(this.unsubscribe$)).subscribe(({ products }) => {
      this.products = products;
      if (products.id) {
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
      }

      this.selectedCategory$.pipe(takeUntil(this.unsubscribe$)).subscribe(category => {
        this.selectedCategory = category;

        this.productDocument$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
          this.productDocument = res;

          if (res.dangerousGoods) {
            this.dangerousGoods = {
              battery: false,
              liquid: false,
              none: false,
              flammable: false,
            };

            res.dangerousGoods.split(',').map(item => {
              switch (item.toLowerCase()) {
                case 'battery':
                  this.dangerousGoods.battery = true;
                  break;
                case 'liquid':
                  this.dangerousGoods.liquid = true;
                  break;
                case 'none':
                  this.dangerousGoods.none = true;
                  break;
                case 'flammable':
                  this.dangerousGoods.flammable = true;
                  break;
              }
            });
          }

          this.stockItems$.pipe(takeUntil(this.unsubscribe$)).subscribe(stockItemsRes => {
            this.stockItems = stockItemsRes;
            if (
              this.selectedCategory &&
              this.productDocument &&
              this.stockItems
            ) {
              this.productsForm = this.createProductForm();
            }
          });
        });
      });
    });

    this.translationLoaderService.loadTranslations(english, myanmar);
  }

  createProductForm(): FormGroup {
    // console.log('productDocument', this.productDocument, this.selectedCategory, this.stockItems);
    return this.formBuilder.group({
      id: [this.products.id],
      supplierId: [this.products.supplierId ? this.products.supplierId : ''],
      name: [this.products.name],
      productNumber: [this.products.productNumber],
      searchDetails: [this.products.searchDetails],
      stockItemLists: this.formBuilder.array(this.createStockItemArrayForm(this.stockItems)),
      productBrandId: [this.products.productBrandId],
      productBrandName: [this.products.productBrandName],
      productCategoryId: [this.selectedCategory.id],
      productCategoryName: [this.selectedCategory.name],
      productCategoryLabel: [this.selectedCategory.parentName + ' / ' + this.selectedCategory.name],
      productDocument: this.formBuilder.group(this.productDocument),
    });
  }

  createStockItemArrayForm(stockItems: IStockItems[]): any[] {
    const stockItemList: any[] = [];
    stockItems.map(item => {
      stockItemList.push(this.formBuilder.group(item));
    });
    return stockItemList;
  }

  onAddStockItem(event): void {
    const stockItem = new StockItems();
    this.stockItems.push(stockItem);
    this.productsForm = this.createProductForm();
  }

  saveProduct(): void {
    const product = this.productsForm.getRawValue();
    console.log('formdata', product);
    this.productDocumentsService.importProductDocument(product.productDocument).subscribe(productDocumentRes => {
      product.productDocumentId = productDocumentRes.id;
      // this.productsService.importProduct(product).subscribe(productResource => {
      //   product.stockItemLists.map(stockItem => {
      //     stockItem.productId = productResource.id;
      //     this.stockItemsService.importStockItem(stockItem).subscribe(() => {
      //       this.showImportCompleted = true;
      //     });
      //   });
      // });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.actionsSubscription.unsubscribe();
  }
}

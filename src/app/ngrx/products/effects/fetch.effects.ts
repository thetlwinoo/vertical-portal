import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { asyncScheduler, EMPTY as empty, of } from 'rxjs';
import { catchError, debounceTime, map, skip, switchMap, takeUntil, filter, mergeMap, tap } from 'rxjs/operators';
import {
  IProductCategory,
  IProductModel,
  IProductBrand,
  IProductChoice,
  IProductAttribute,
  IProductOption,
  IWarrantyTypes,
  IBarcodeTypes,
  IProductDocuments,
  IStockItems,
} from '@vertical/models';
import { FetchActions } from '../actions';
import {
  ProductCategoryService,
  ProductModelService,
  ProductBrandService,
  ProductChoiceService,
  ProductAttributeService,
  ProductOptionService,
  WarrantyTypesService,
  BarcodeTypesService,
  ProductDocumentsService,
  StockItemsService,
} from '@vertical/services';
import { select, Store } from '@ngrx/store';
import * as fromProducts from 'app/ngrx/products/reducers';

@Injectable()
export class FetchEffects {
  fetchCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchCategories),
      switchMap(() =>
        this.productCategoryService.fetchCategoriesTree().pipe(
          filter((res: HttpResponse<IProductCategory[]>) => res.ok),
          map((res: HttpResponse<IProductCategory[]>) => FetchActions.fetchCategoriesSuccess({ categories: res.body })),
          catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
        )
      )
    )
  );

  // fetchModels$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FetchActions.fetchModels),
  //     mergeMap(({ id }) =>
  //       this.productModelService
  //         .query({
  //           'merchantId.equals': id,
  //         })
  //         .pipe(
  //           filter((res: HttpResponse<IProductModel[]>) => res.ok),
  //           map((res: HttpResponse<IProductModel[]>) => FetchActions.fetchModelsSuccess({ models: res.body })),
  //           catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
  //         )
  //     )
  //   )
  // );

  fetchStockItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchStockItems),
      mergeMap(({ productId }) =>
        this.stockItemsService
          .query({
            'productId.equals': productId,
          })
          .pipe(
            filter((res: HttpResponse<IStockItems[]>) => res.ok),
            map((res: HttpResponse<IStockItems[]>) => FetchActions.fetchStockItemsSuccess({ stockItems: res.body })),
            catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
          )
      )
    )
  );

  fetchProductDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchProductDocument),
      mergeMap(({ id }) =>
        this.productDocumentsService
          .query({
            'productId.equals': id,
          })
          .pipe(
            filter((res: HttpResponse<IProductDocuments[]>) => res.ok),
            map((res: HttpResponse<IProductDocuments[]>) => FetchActions.fetchProductDocumentSuccess({ productDocument: res.body[0] })),
            catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
          )
      )
    )
  );

  fetchBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchBrands),
      mergeMap(({ id }) =>
        this.productBrandService
          .query({
            'supplierId.equals': id,
          })
          .pipe(
            filter((res: HttpResponse<IProductBrand[]>) => res.ok),
            map((res: HttpResponse<IProductBrand[]>) => FetchActions.fetchBrandsSuccess({ brands: res.body })),
            catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
          )
      )
    )
  );

  fetchProductChoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchProductChoice),
      mergeMap(({ prop }) =>
        this.productChoiceService
          .query({
            'productCategoryId.equals': prop.id,
          })
          .pipe(
            filter((res: HttpResponse<IProductChoice[]>) => res.ok),
            switchMap((res: HttpResponse<IProductChoice[]>) => {
              console.log('product choice res', res);
              return [
                FetchActions.fetchProductAttribute(
                  {
                    prop:
                    {
                      productAttributeSetId: res.body.length ? res.body[0].productAttributeSetId : null, supplierId: prop.supplierId
                    }
                  }
                ),
                FetchActions.fetchProductOption({
                  prop: { productOptionSetId: res.body.length ? res.body[0].productOptionSetId : null, supplierId: prop.supplierId }
                }),
                FetchActions.fetchProductChoiceSuccess({ choice: res.body }),
              ];
            }),
            catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
          )
      )
    )
  );

  fetchProductAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchProductAttribute),
      mergeMap(({ prop }) =>
        this.productAttributeService
          .query({
            'productAttributeSetId.equals': prop.productAttributeSetId,
            'supplierId.equals': prop.supplierId
          })
          .pipe(
            filter((res: HttpResponse<IProductAttribute[]>) => res.ok),
            map((res: HttpResponse<IProductAttribute[]>) => FetchActions.fetchProductAttributeSuccess({ productAttributeList: res.body })),
            catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
          )
      )
    )
  );

  fetchProductOption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchProductOption),
      mergeMap(({ prop }) =>
        this.productOptionService
          .query({
            'productOptionSetId.equals': prop.productOptionSetId,
            'supplierId.equals': prop.supplierId
          })
          .pipe(
            filter((res: HttpResponse<IProductOption[]>) => res.ok),
            map((res: HttpResponse<IProductOption[]>) => FetchActions.fetchProductOptionSuccess({ productOptionList: res.body })),
            catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
          )
      )
    )
  );

  fetchWarrantyTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchWarrantyType),
      switchMap(() =>
        this.warrantyTypesService.query().pipe(
          filter((res: HttpResponse<IWarrantyTypes[]>) => res.ok),
          map((res: HttpResponse<IWarrantyTypes[]>) => FetchActions.fetchWarrantyTypeSuccess({ warrantyTypes: res.body })),
          catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
        )
      )
    )
  );

  fetchBarcodeTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FetchActions.fetchBarcodeType),
      switchMap(() =>
        this.barcodeTypesService.query().pipe(
          filter((res: HttpResponse<IBarcodeTypes[]>) => res.ok),
          map((res: HttpResponse<IBarcodeTypes[]>) => FetchActions.fetchBarcodeTypeSuccess({ barcodeTypes: res.body })),
          catchError(err => of(FetchActions.fetchFailure({ errorMsg: err.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromProducts.State>,
    private productCategoryService: ProductCategoryService,
    private productModelService: ProductModelService,
    private productBrandService: ProductBrandService,
    private productChoiceService: ProductChoiceService,
    private productAttributeService: ProductAttributeService,
    private productOptionService: ProductOptionService,
    private warrantyTypesService: WarrantyTypesService,
    private barcodeTypesService: BarcodeTypesService,
    private productDocumentsService: ProductDocumentsService,
    private stockItemsService: StockItemsService
  ) { }
}

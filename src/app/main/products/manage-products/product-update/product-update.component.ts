/* tslint:disable */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISuppliers, IProductCategory, IProductBrand, IProductDocuments, IProducts, Products, IStockItems, IProductChoice, ProductDocuments, StockItems, ISpecialFeatures } from '@vertical/models';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { JhiDataUtils, JhiEventManager, JhiFileLoadError, JhiEventWithContent } from 'ng-jhipster';
import { ProductsService, ProductDocumentsService, SuppliersService, ProductCategoryService, ProductBrandService, StockItemsService, ProductChoiceService } from '@vertical/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import { map, takeUntil } from 'rxjs/operators';
import { DATE_TIME_FORMAT } from '@vertical/constants';
import { Observable, Subject, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { FetchActions } from 'app/ngrx/products/actions';
import * as fromProducts from 'app/ngrx/products/reducers';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { CommonUtils } from '@vertical/utils/common.utils';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { RootUtils } from '@vertical/utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Moment } from 'moment';

type SelectableEntity = IProductDocuments | ISuppliers | IProductCategory | IProductBrand;

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.scss'],
})
export class ProductUpdateComponent implements OnInit, OnDestroy {

  isSaving = false;
  productDocuments: IProductDocuments = {};
  suppliers: ISuppliers[] = [];
  productcategories: IProductCategory[] = [];
  categories$: Observable<IProductCategory[]>;
  categories: IProductCategory[];
  products: IProducts;
  stockItems: IStockItems[] = [];
  productChoice: IProductChoice;
  eventSubscriber?: Subscription;
  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;
  specialFeatures: ISpecialFeatures[] = [];
  today: Moment;

  productDocumentForm = this.fb.group({
    id: [],
    videoUrl: [],
    highlights: [],
    longDescription: [],
    shortDescription: [],
    whatInTheBox: [],
    careInstructions: [],
    productType: [],
    modelName: [],
    modelNumber: [],
    fabricType: [],
    specialFeatures: [],
    productComplianceCertificate: [],
    genuineAndLegal: [],
    countryOfOrigin: [],
    usageAndSideEffects: [],
    safetyWarnning: [],
    warrantyPeriod: [],
    warrantyPolicy: [],
    dangerousGoods: [],
    lastEditedBy: [],
    lastEditedWhen: [],
    productId: [],
    warrantyTypeId: [],
  });

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    handle: [],
    searchDetails: [],
    productNumber: [],
    sellCount: [],
    productDetails: [],
    totalWishlist: [],
    overallRating: [],
    preferredInd: [],
    freeShippingInd: [],
    madeInMyanmarInd: [],
    questionsAboutProductInd: [true],
    releaseDate: [null, [Validators.required]],
    availableDate: [null, [Validators.required]],
    activeFlag: [false, [Validators.required]],
    lastEditedBy: [],
    lastEditedWhen: [],
    validFrom: [],
    validTo: [],
    supplierId: [],
    productCategoryId: [],
    productCategoryCascade: [],
    productBrandId: [],
    productDocument: this.productDocumentForm,
    stockItemLists: this.fb.array([])
  });

  get stockItemListsForm(): FormArray {
    if (this.editForm) {
      return this.editForm.get('stockItemLists') as FormArray;
    }
  }

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected productsService: ProductsService,
    protected productDocumentsService: ProductDocumentsService,
    protected suppliersService: SuppliersService,
    protected productCategoryService: ProductCategoryService,
    protected productChoiceService: ProductChoiceService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<fromProducts.State>,
    private authStore: Store<fromAuth.State>,
    protected stockItemsService: StockItemsService,
    private msg: NzMessageService,
    private router: Router
  ) {
    this.categories$ = store.pipe(select(fromProducts.getFetchCategoriesTree));
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.store.dispatch(FetchActions.fetchCategories());
    this.registerChangeInStockItems();

    this.activatedRoute.data.subscribe(({ products }) => {
      this.products = products;

      if (!products.id) {
        const today = moment().startOf('day');
        this.today = today;
        products.releaseDate = today;
        products.availableDate = today;
        products.lastEditedWhen = today;
        products.validFrom = today;
        products.validTo = today;
        this.updateProductDocumentForm(new ProductDocuments);
      } else {
        this.loadStockItems();

        this.productDocumentsService.query({ 'productId.equals': products.id }).subscribe((res: HttpResponse<IProductDocuments[]>) => {
          this.productDocuments = res.body[0] || {};

          if (this.productDocuments?.specialFeatures) {
            this.specialFeatures = JSON.parse(this.productDocuments.specialFeatures);
          }

          this.updateProductDocumentForm(this.productDocuments);
        });
      }

      this.updateProductForm(products);

      this.selectedSupplier$.subscribe(supplier => {
        this.selectedSupplier = supplier;

        if (this.selectedSupplier) {
          this.editForm.patchValue({ supplierId: this.selectedSupplier.id });

          this.categories$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
            this.categories = data;
            if (products.productCategoryId) {
              this.editForm.patchValue({ productCategoryCascade: this.getProductCategoryCascade(products.productCategoryId) });
              this.store.dispatch(FetchActions.fetchProductChoice({ prop: { id: products.productCategoryId, supplierId: this.selectedSupplier.id } }));
            }
          });
        }

      });

      this.suppliersService.query().subscribe((res: HttpResponse<ISuppliers[]>) => (this.suppliers = res.body || []));

      this.productCategoryService.query().subscribe((res: HttpResponse<IProductCategory[]>) => (this.productcategories = res.body || []));
    });
  }

  loadStockItems(): void {
    this.stockItemsService.query({ 'productId.equals': this.products.id }).subscribe((res: HttpResponse<IStockItems[]>) => {
      this.stockItems = res.body || [];
      this.updateStockItemArrayForm(this.stockItems);
    });
  }
  updateProductForm(products: IProducts): void {
    this.editForm.patchValue({
      id: products.id,
      name: products.name,
      handle: products.handle,
      searchDetails: products.searchDetails,
      productNumber: products.productNumber,
      sellCount: products.sellCount,
      productDetails: products.productDetails,
      totalWishlist: products.totalWishlist,
      overallRating: products.overallRating,
      preferredInd: products.preferredInd,
      freeShippingInd: products.freeShippingInd,
      madeInMyanmarInd: products.madeInMyanmarInd,
      questionsAboutProductInd: products.questionsAboutProductInd,
      releaseDate: products.releaseDate ? products.releaseDate.format(DATE_TIME_FORMAT) : null,
      availableDate: products.availableDate ? products.availableDate.format(DATE_TIME_FORMAT) : null,
      activeFlag: products.activeFlag,
      lastEditedBy: products.lastEditedBy,
      lastEditedWhen: products.lastEditedWhen ? products.lastEditedWhen.format(DATE_TIME_FORMAT) : null,
      validFrom: products.validFrom ? products.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: products.validTo ? products.validTo.format(DATE_TIME_FORMAT) : null,
      supplierId: products.supplierId,
      productCategoryId: products.productCategoryId,
      productBrandId: products.productBrandId
    });
  }

  updateProductDocumentForm(productDocuments: IProductDocuments): void {
    console.log('productDocuments', productDocuments)
    let dangerousGoods: any[] = [
      { label: 'Battery', value: 'battery', checked: false },
      { label: 'Liquid', value: 'liquid', checked: false },
      { label: 'None', value: 'none', checked: false },
      { label: 'Flammable', value: 'flammable', checked: false }
    ];

    if (productDocuments.dangerousGoods) {
      productDocuments.dangerousGoods.split(',').map(item => {
        switch (item.toLowerCase()) {
          case 'battery':
            const battery = dangerousGoods.find(x => x.value === 'battery');
            battery.checked = true;
            break;
          case 'liquid':
            const liquid = dangerousGoods.find(x => x.value === 'liquid');
            liquid.checked = true;
            break;
          case 'none':
            const none = dangerousGoods.find(x => x.value === 'none');
            none.checked = true;
            break;
          case 'flammable':
            const flammable = dangerousGoods.find(x => x.value === 'flammable');
            flammable.checked = true;
            break;
        }
      });
    }

    // console.log('productDocuments', productDocuments, dangerousGoods)

    this.productDocumentForm.patchValue({
      id: productDocuments.id,
      videoUrl: productDocuments.videoUrl,
      highlights: productDocuments.highlights,
      longDescription: productDocuments.longDescription,
      shortDescription: productDocuments.shortDescription,
      whatInTheBox: productDocuments.whatInTheBox,
      careInstructions: productDocuments.careInstructions,
      productType: productDocuments.productType,
      modelName: productDocuments.modelName,
      modelNumber: productDocuments.modelNumber,
      fabricType: productDocuments.fabricType,
      specialFeatures: productDocuments.specialFeatures,
      productComplianceCertificate: productDocuments.productComplianceCertificate,
      genuineAndLegal: productDocuments.genuineAndLegal,
      countryOfOrigin: productDocuments.countryOfOrigin,
      usageAndSideEffects: productDocuments.usageAndSideEffects,
      safetyWarnning: productDocuments.safetyWarnning,
      warrantyPeriod: productDocuments.warrantyPeriod,
      warrantyPolicy: productDocuments.warrantyPolicy,
      dangerousGoods: dangerousGoods,
      lastEditedBy: productDocuments.lastEditedBy ? productDocuments.lastEditedBy : 'SYSTEM',
      lastEditedWhen: productDocuments.lastEditedWhen ? productDocuments.lastEditedWhen.format(DATE_TIME_FORMAT) : moment(Date.now(), DATE_TIME_FORMAT),
      productId: productDocuments.productId,
      warrantyTypeId: productDocuments.warrantyTypeId,
    });

    this.editForm.patchValue({ productDocument: this.productDocumentForm });
  }

  updateStockItemArrayForm(stockItems: IStockItems[]): void {
    const stockItemsFormArray = this.editForm.get("stockItemLists") as FormArray;
    stockItemsFormArray.clear();
    stockItems.map(item => {
      stockItemsFormArray.push(this.createStockItemForm(item));
    });
    // console.log('stockItemsFormArray', this.editForm.get("stockItemLists"))
  }

  createStockItemForm(stockItems: IStockItems): FormGroup {
    return this.fb.group({
      id: stockItems.id,
      name: stockItems.name,
      handle: stockItems.handle,
      vendorCode: stockItems.vendorCode,
      vendorSKU: stockItems.vendorSKU,
      generatedSKU: stockItems.generatedSKU,
      barcode: stockItems.barcode,
      taxRate: stockItems.taxRate,
      unitPrice: stockItems.unitPrice,
      recommendedRetailPrice: stockItems.recommendedRetailPrice,
      typicalWeightPerUnit: stockItems.typicalWeightPerUnit,
      quantityOnHand: stockItems.quantityOnHand,
      shelf: stockItems.shelf,
      bin: stockItems.bin,
      lastStockTakeQuantity: stockItems.lastStockTakeQuantity,
      lastCostPrice: stockItems.lastCostPrice,
      reorderLevel: stockItems.reorderLevel,
      targetStockLevel: stockItems.targetStockLevel,
      leadTimeDays: stockItems.leadTimeDays,
      quantityPerOuter: stockItems.quantityPerOuter,
      isChillerStock: stockItems.isChillerStock,
      itemLength: stockItems.itemLength,
      itemWidth: stockItems.itemWidth,
      itemHeight: stockItems.itemHeight,
      itemWeight: stockItems.itemWeight,
      itemPackageLength: stockItems.itemPackageLength,
      itemPackageWidth: stockItems.itemPackageWidth,
      itemPackageHeight: stockItems.itemPackageHeight,
      itemPackageWeight: stockItems.itemPackageWeight,
      noOfPieces: stockItems.noOfPieces,
      noOfItems: stockItems.noOfItems,
      manufacture: stockItems.manufacture,
      marketingComments: stockItems.marketingComments,
      internalComments: stockItems.internalComments,
      sellStartDate: stockItems.sellStartDate ? stockItems.sellStartDate.format(DATE_TIME_FORMAT) : null,
      sellEndDate: stockItems.sellEndDate ? stockItems.sellEndDate.format(DATE_TIME_FORMAT) : null,
      sellCount: stockItems.sellCount,
      tags: stockItems.tags,
      searchDetails: stockItems.searchDetails,
      customFields: stockItems.customFields,
      thumbnailPhoto: stockItems.thumbnailPhoto,
      liveInd: stockItems.liveInd,
      cashOnDeliveryInd: stockItems.cashOnDeliveryInd,
      lastEditedBy: stockItems.lastEditedBy,
      lastEditedWhen: stockItems.lastEditedWhen ? stockItems.lastEditedWhen.format(DATE_TIME_FORMAT) : null,
      activeFlag: stockItems.activeFlag,
      localization: stockItems.localization,
      validFrom: stockItems.validFrom ? stockItems.validFrom.format(DATE_TIME_FORMAT) : null,
      validTo: stockItems.validTo ? stockItems.validTo.format(DATE_TIME_FORMAT) : null,
      supplierId: stockItems.supplierId,
      itemLengthUnitId: stockItems.itemLengthUnitId,
      itemWidthUnitId: stockItems.itemWidthUnitId,
      itemHeightUnitId: stockItems.itemHeightUnitId,
      packageLengthUnitId: stockItems.packageLengthUnitId,
      packageWidthUnitId: stockItems.packageWidthUnitId,
      packageHeightUnitId: stockItems.packageHeightUnitId,
      itemPackageWeightUnitId: stockItems.itemPackageWeightUnitId,
      productAttributeId: stockItems.productAttributeId,
      productOptionId: stockItems.productOptionId,
      materials: stockItems.materials,
      currencyId: stockItems.currencyId,
      barcodeTypeId: stockItems.barcodeTypeId,
      productId: stockItems.productId,
      productAttributeSetId: [],
      productOptionSetId: []
    });
  }

  getProductCategoryCascade(id: number): number[] {
    const category = CommonUtils.findById(this.categories, id);
    return category?.parentCascade.split(',').map(x => +x);
  }

  onSelectionChange(selectedOptions: NzCascaderOption[]): void {
    const leaf = selectedOptions.find(o => o.isLeaf === true);
    this.editForm.patchValue({ productCategoryId: leaf.id })
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      // this.eventManager.broadcast(
      //   new JhiEventWithContent<AlertError>('gatewayApp.error', { ...err, key: 'error.file.' + err.key })
      // );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    let importCount = 0;
    const today = moment().startOf('day');
    const products = this.createProductFromForm();
    const dangerousGoodsString = this.productDocumentForm.get('dangerousGoods').value.filter((x: any) => x.checked === true).map((i: any) => i.label).join(',');

    this.productsService.importProduct(products).subscribe(productRes => {
      const productsDocument = products.productDocument;
      productsDocument.dangerousGoods = dangerousGoodsString;
      productsDocument.productId = productRes.id;
      productsDocument.lastEditedWhen = today;

      this.productDocumentsService.importProductDocument(productsDocument).subscribe(() => {
        products.stockItemLists.map(stockItem => {
          stockItem.productId = productRes.id;
          stockItem.lastEditedWhen = today;
          stockItem.validFrom = today;
          stockItem.supplierId = this.selectedSupplier.id;
          console.log('stockItem', stockItem)
          this.stockItemsService.importStockItem(stockItem).subscribe(stockItemRes => {
            importCount += 1;
            if (importCount === products.stockItemLists.length) {
              this.productsService.updateProductDetails(productRes.id).subscribe(() => {
                this.msg.success('Data has been sucessfully published.');
                this.router.navigate(['/main/products/manage-products']);
              })
            }
          });
        });
      });
    });

    // if (products.id) {
    //   this.subscribeToSaveResponse(this.productsService.update(products));
    // } else {
    //   this.subscribeToSaveResponse(this.productsService.create(products));
    // }
    console.log('final form', products)
  }

  private createProductFromForm(): IProducts {
    return {
      ...new Products(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      handle: this.editForm.get(['handle'])!.value ? this.editForm.get(['handle'])!.value : RootUtils.handleize(this.editForm.get(['name'])!.value),
      searchDetails: this.editForm.get(['searchDetails'])!.value,
      productNumber: this.editForm.get(['productNumber'])!.value,
      sellCount: this.editForm.get(['sellCount'])!.value,
      productDetails: this.editForm.get(['productDetails'])!.value,
      totalWishlist: this.editForm.get(['totalWishlist'])!.value,
      overallRating: this.editForm.get(['overallRating'])!.value,
      preferredInd: this.editForm.get(['preferredInd'])!.value,
      freeShippingInd: this.editForm.get(['freeShippingInd'])!.value,
      madeInMyanmarInd: this.editForm.get(['madeInMyanmarInd'])!.value,
      questionsAboutProductInd: this.editForm.get(['questionsAboutProductInd'])!.value,
      releaseDate: this.editForm.get(['releaseDate'])!.value
        ? moment(this.editForm.get(['releaseDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      availableDate: this.editForm.get(['availableDate'])!.value
        ? moment(this.editForm.get(['availableDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      activeFlag: this.editForm.get(['activeFlag'])!.value,
      lastEditedBy: this.editForm.get(['lastEditedBy'])!.value ? this.editForm.get(['lastEditedBy'])!.value : 'SYSTEM',
      lastEditedWhen: this.editForm.get(['lastEditedWhen'])!.value
        ? moment(this.editForm.get(['lastEditedWhen'])!.value, DATE_TIME_FORMAT)
        : moment(Date.now(), DATE_TIME_FORMAT),
      validFrom: this.editForm.get(['validFrom'])!.value ? moment(this.editForm.get(['validFrom'])!.value, DATE_TIME_FORMAT) : moment(Date.now(), DATE_TIME_FORMAT),
      validTo: this.editForm.get(['validTo'])!.value ? moment(this.editForm.get(['validTo'])!.value, DATE_TIME_FORMAT) : undefined,
      supplierId: this.editForm.get(['supplierId'])!.value,
      productCategoryId: this.editForm.get(['productCategoryId'])!.value,
      productBrandId: this.editForm.get(['productBrandId'])!.value,
      productDocument: this.editForm.get(['productDocument'])!.value,
      stockItemLists: this.editForm.get(['stockItemLists'])!.value,
    };
  }

  private createProductDocumentFromForm(productDocumentForm: FormGroup): IProductDocuments {
    return {
      ...new ProductDocuments(),
      id: productDocumentForm.get(['id'])!.value,
      videoUrl: productDocumentForm.get(['videoUrl'])!.value,
      highlights: productDocumentForm.get(['highlights'])!.value,
      longDescription: productDocumentForm.get(['longDescription'])!.value,
      shortDescription: productDocumentForm.get(['shortDescription'])!.value,
      whatInTheBox: productDocumentForm.get(['whatInTheBox'])!.value,
      careInstructions: productDocumentForm.get(['careInstructions'])!.value,
      productType: productDocumentForm.get(['productType'])!.value,
      modelName: productDocumentForm.get(['modelName'])!.value,
      modelNumber: productDocumentForm.get(['modelNumber'])!.value,
      fabricType: productDocumentForm.get(['fabricType'])!.value,
      specialFeatures: productDocumentForm.get(['specialFeatures'])!.value,
      productComplianceCertificate: this.editForm.get(['productComplianceCertificate'])!.value,
      genuineAndLegal: productDocumentForm.get(['genuineAndLegal'])!.value,
      countryOfOrigin: productDocumentForm.get(['countryOfOrigin'])!.value,
      usageAndSideEffects: productDocumentForm.get(['usageAndSideEffects'])!.value,
      safetyWarnning: productDocumentForm.get(['safetyWarnning'])!.value,
      warrantyPeriod: productDocumentForm.get(['warrantyPeriod'])!.value,
      warrantyPolicy: productDocumentForm.get(['warrantyPolicy'])!.value,
      dangerousGoods: productDocumentForm.get(['dangerousGoods'])!.value,
      lastEditedBy: productDocumentForm.get(['lastEditedBy'])!.value,
      lastEditedWhen: productDocumentForm.get(['lastEditedWhen'])!.value
        ? moment(productDocumentForm.get(['lastEditedWhen'])!.value, DATE_TIME_FORMAT)
        : moment(Date.now(), DATE_TIME_FORMAT),
      productId: productDocumentForm.get(['productId'])!.value,
      warrantyTypeId: productDocumentForm.get(['warrantyTypeId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProducts>>): void {
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

  registerChangeInStockItems(): void {
    this.eventSubscriber = this.eventManager.subscribe('stockItemListModification', () => {
      // console.log('modified stock items');
      this.loadStockItems();
    });
  }

  checkForm() {
    console.log(this.stockItemListsForm.controls.length, this.editForm.invalid, this.productDocumentForm.invalid);
    console.log(this.stockItemListsForm, this.editForm, this.productDocumentForm);
  }
  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }
}

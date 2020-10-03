import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, debounceTime, tap, takeUntil } from 'rxjs/operators';
import { JhiParseLinks, JhiDataUtils, JhiAlertService } from 'ng-jhipster';
import * as _ from 'lodash';
import { RootUtils } from '@vertical/utils';
import * as moment from 'moment';

import { select, Store } from '@ngrx/store';
import * as fromProducts from 'app/ngrx/products/reducers';
import { ProductActions } from 'app/ngrx/products/actions';
import { Router } from '@angular/router';
import { Account } from '@vertical/core/user/account.model';
import { AccountService } from '@vertical/core';

import {
  UploadExcel,
  Products,
  StockItems,
  ProductDocuments,
  IAlerts,
  Alerts,
  ISuppliers,
  IStockItemsLocalize,
  StockItemsLocalize,
  ICulture,
  IProductBrand,
  ProductBrand,
  IProductBrandLocalize,
  ProductBrandLocalize
} from '@vertical/models';

import {
  StockItemsService,
  ProductsService,
  DocumentProcessService,
  ProductDocumentsService,
  ProductTagsService,
  StockItemHoldingsService,
  CultureService,
  StockItemsLocalizeService,
  ProductBrandService,
  ProductBrandLocalizeService
} from '@vertical/services';

import { NzMessageService } from 'ng-zorro-antd/message';
import * as fromAuth from 'app/ngrx/auth/reducers';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BatchUploadComponent implements OnInit, OnDestroy {
  @ViewChild('file', { static: true }) file: ElementRef;

  account: Account;
  isUploaded = false;
  isImported = false;
  selectedMode = 0;
  total = 0;
  uploadedTransactionid: number;
  loading = true;
  loadingUploadExcel = false;
  loadingUploadTransactions = true;
  errorMessage = '';
  errorVisible = false;
  uploadedFiles: any[] = [];
  importCount = 0;
  importTotalCount = 0;
  importPercentage = 0.0;
  // showImportCompleted = false;
  cultures: ICulture[];
  productBrandList: IProductBrand[] = [];

  filterType = 0;
  uploadExcelArray: string[];
  uploadData$: Observable<UploadExcel[]>;
  uploadData: UploadExcel[];
  selectedRows: UploadExcel[] = [];
  productList: Products[] = [];
  // tagList: string[] = [];

  showAlertInd = false;
  alert: IAlerts = new Alerts();

  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected router: Router,
    protected productsService: ProductsService,
    protected productDocumentsService: ProductDocumentsService,
    protected parseLinks: JhiParseLinks,
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected documentProcessService: DocumentProcessService,
    protected stockItemsService: StockItemsService,
    private accountService: AccountService,
    private productTagsService: ProductTagsService,
    protected stockItemHoldingsService: StockItemHoldingsService,
    private store: Store<fromProducts.State>,
    private authStore: Store<fromAuth.State>,
    private msg: NzMessageService,
    private cultureService: CultureService,
    private stockItemLocalizeService: StockItemsLocalizeService,
    private productBrandService: ProductBrandService,
    private productBrandLocalizeService: ProductBrandLocalizeService
  ) {
    this.selectedSupplier$ = this.authStore.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.uploadData$ = this.documentProcessService.data$.pipe(
      debounceTime(0),
      map(data => data.map(item => new UploadExcel(item))),
      tap((data: UploadExcel[]) => data.splice(0, 1))
    );

    this.accountService.identity().subscribe(account => {
      this.account = account;
    });

    this.cultureService.query().pipe(takeUntil(this.unsubscribe$)).subscribe(res => this.cultures = res.body);

    this.selectedSupplier$.subscribe(selectedSupplier => {
      this.selectedSupplier = selectedSupplier;
    });

    this.uploadData$.subscribe(data => {
      console.log('upload data', data);

      // this.tagList = [];
      this.productBrandList = [];
      this.importTotalCount = data.length;
      this.uploadData = data;

      this.productList = [];
      const grouped = _.mapValues(_.groupBy(data, 'productName'), clist => clist.map(item => _.omit(item, 'productName')));
      _.entries(grouped).map(mapArray => {
        const key = mapArray[0];
        const values: UploadExcel[] = mapArray[1];
        const product: Products = new Products();
        product.name = key;
        product.handle = RootUtils.handleize(key);
        product.productCategoryName = values[0].productCategory;
        product.productBrandName = values[0].brandName.trim();
        product.releaseDate = values[0].releaseDate;
        product.availableDate = values[0].availableDate;
        product.lastEditedBy = this.account.id;
        product.lastEditedWhen = moment();
        product.validFrom = moment();
        product.freeShippingInd = values[0].freeDelivery;
        product.madeInMyanmarInd = values[0].madeInMyanmar;
        this.createProductBrand(values[0].brandName.trim(), values[0].brandMyanmarName.trim());
        product.stockItemLists = [];
        const productDocument: ProductDocuments = new ProductDocuments();
        productDocument.videoUrl = values[0].videoUrl || '';
        productDocument.highlights = values[0].highlights || '';
        productDocument.longDescription = values[0].longDescription || '';
        productDocument.shortDescription = values[0].shortDescription || '';
        productDocument.careInstructions = values[0].careInstruction || '';
        productDocument.productType = values[0].productType || '';
        productDocument.modelName = values[0].modelName || '';
        productDocument.modelNumber = values[0].modelNumber || '';
        productDocument.whatInTheBox = values[0].whatInTheBox || '';
        productDocument.specialFeatures = values[0].specialFeatures || '';
        productDocument.productComplianceCertificate = values[0].productComplianceCertificate || '';
        productDocument.genuineAndLegal = values[0].genuineAndLegal || false;
        productDocument.countryOfOrigin = values[0].countryOfOrigin || '';
        productDocument.usageAndSideEffects = values[0].instructionsForUsageAndSideEffects || '';
        productDocument.safetyWarnning = values[0].safetyWarnning || '';
        productDocument.warrantyPeriod = values[0].warrentyPeriod || '';
        productDocument.warrantyTypeName = values[0].warrantyType || '';
        productDocument.dangerousGoods = values[0].dangerousGoodsRegulations || '';

        product.productDocument = productDocument;
        let searchDetails = '';
        values.map(item => {
          const stockItem: StockItems = new StockItems();
          stockItem.name = item.itemName;
          stockItem.vendorCode = item.vendorCode;
          stockItem.vendorSKU = item.vendorSKU;
          stockItem.barcode = item.barcode;
          stockItem.unitPrice = item.promotionPrice;
          stockItem.recommendedRetailPrice = item.retailPrice;
          stockItem.quantityOnHand = item.quantityOnHand;
          stockItem.itemLength = item.itemLength;
          stockItem.itemWidth = item.itemWidth;
          stockItem.itemHeight = item.itemHeight;
          stockItem.itemWeight = item.itemWeight;
          stockItem.itemPackageLength = item.itemPackageLength;
          stockItem.itemPackageWidth = item.itemPackageWidth;
          stockItem.itemPackageHeight = item.itemPackageHeight;
          stockItem.itemPackageWeight = item.itemPackageWeight;
          stockItem.noOfPieces = item.noOfPieces;
          stockItem.noOfItems = item.noOfItem;
          stockItem.manufacture = item.manufacture;
          stockItem.sellStartDate = item.sellStartDate;
          stockItem.sellEndDate = item.sellEndDate;
          stockItem.customFields = '';
          stockItem.thumbnailPhoto = '';
          stockItem.activeFlag = false;
          stockItem.itemLengthUnitCode = item.itemLengthUnit;
          stockItem.itemWidthUnitCode = item.itemWidthUnit;
          stockItem.itemHeightUnitCode = item.itemHeightUnit;
          stockItem.packageLengthUnitCode = item.packageLengthUnit || '';
          stockItem.packageWidthUnitCode = item.packageWidthUnit || '';
          stockItem.packageHeightUnitCode = item.packageHeightUnit || '';
          stockItem.itemPackageWeightUnitCode = item.itemPackageWeightUnit || '';
          stockItem.productAttributeValue = item.productAttribute;
          stockItem.productOptionValue = item.productOption;
          stockItem.materials = item.productMaterial;
          stockItem.barcodeTypeName = item.barcodeType;
          stockItem.currencyCode = item.currencyCode;
          stockItem.lastEditedBy = this.account.id;
          stockItem.lastEditedWhen = moment();
          stockItem.quantityOnHand = item.quantityOnHand;
          stockItem.lastStockTakeQuantity = 0;
          stockItem.lastCostPrice = item.lastCostPrice;
          stockItem.reorderLevel = 1;
          stockItem.targetStockLevel = 100;
          stockItem.searchDetails = item.searchKeywords;
          stockItem.isChillerStock = item.isChillerStock;
          stockItem.cashOnDeliveryInd = item.cashOnDelivery || false;
          stockItem.validFrom = moment();
          product.stockItemLists.push(stockItem);
          searchDetails = searchDetails + item.searchKeywords + ';';

          // item.searchKeywords.split(';').map(keyword => {
          //   if (!this.tagList.includes(keyword)) {
          //     this.tagList.push(keyword);
          //   }
          // });
          const englishLocalize: IStockItemsLocalize = new StockItemsLocalize();
          englishLocalize.cultureId = this.getEnglishCulture()?.id;
          englishLocalize.name = item.itemName;

          const myanmarLocalize: IStockItemsLocalize = new StockItemsLocalize();
          myanmarLocalize.cultureId = this.getMyanmarCulture()?.id;
          myanmarLocalize.name = item.itemMyanmarName;

          stockItem.stockItemLocalizeList = [];
          stockItem.stockItemLocalizeList.push(englishLocalize);
          stockItem.stockItemLocalizeList.push(myanmarLocalize);
        });

        product.searchDetails = [...new Set(searchDetails.split(';'))].join(';').slice(0, -1);

        this.productList.push(product);
      });

      if (data.length > 0) {
        this.saveProductBrand();
      }
    });
  }

  onUpload(event: any): void {
    this.uploadedFiles = [];
    for (const file of event.target.files) {
      this.uploadedFiles.push(file);
    }

    this.documentProcessService.parseExcelFile(this.uploadedFiles[0]);
    this.loadingUploadExcel = false;
  }

  onUploadExcelSelectAll(): void {
    this.selectedRows = this.uploadData;
  }

  onUploadExcelUnSelectAll(): void {
    this.selectedRows = [];
  }

  confirmDeleteStockItemTemp(id: number): void {
    this.documentProcessService.clearData();
    this.selectedRows = [];
    // this.rootAlertService.setMessage('Clear successfully', 'success');
  }

  clearUploadedRecords(): void {
    this.documentProcessService.clearData();
    this.selectedRows = [];
    this.file.nativeElement.value = '';
  }

  onImportToSystem(event: any): void {
    this.importCount = 0;
    this.productList.map(product => {
      product.supplierId = this.selectedSupplier.id;
      this.productsService.importProduct(product).subscribe(productResource => {
        product.productDocument.productId = productResource.id;
        this.productDocumentsService.importProductDocument(product.productDocument).subscribe();

        product.stockItemLists.map(stockItem => {
          stockItem.productId = productResource.id;
          stockItem.supplierId = this.selectedSupplier.id;
          this.stockItemsService.importStockItem(stockItem).subscribe((stockItemRes) => {
            stockItem.stockItemLocalizeList.map((stockItemsLocalize) => {
              stockItemsLocalize.stockItemId = stockItemRes.id;
              this.stockItemLocalizeService.create(stockItemsLocalize).subscribe();
            });

            this.importCount++;
            this.importPercentage = Math.floor((this.importCount * 100) / this.importTotalCount);
            if (this.importPercentage >= 100) {
              this.msg.success(`Total ${this.importCount} imported`);
              this.router.navigate(['/main/products/manage-products']);
            }
          });
        });
      });
    });
  }

  createProductBrand(brandName: string, brandMyanmarName: string) {
    const productBrandFilter = this.productBrandList.find(x => x.name === brandName);

    if (!productBrandFilter) {
      const productBrand: IProductBrand = new ProductBrand();
      productBrand.name = brandName;
      productBrand.myanmarName = brandMyanmarName;
      productBrand.handle = RootUtils.handleize(brandName);
      productBrand.validFrom = moment();
      productBrand.activeFlag = true;
      this.productBrandList.push(productBrand);
    }
  }

  saveProductBrand() {
    this.productBrandList.map(item => {
      const englishBrandLocalize: IProductBrandLocalize = new ProductBrandLocalize();
      englishBrandLocalize.name = item.name;
      englishBrandLocalize.cultureId = this.getEnglishCulture()?.id;

      const myanmarBrandLocalize: IProductBrandLocalize = new ProductBrandLocalize();
      myanmarBrandLocalize.name = item.myanmarName;
      myanmarBrandLocalize.cultureId = this.getMyanmarCulture()?.id;

      this.productBrandService.saveExtend(item).subscribe(res => {
        const newBrand = res.body;
        englishBrandLocalize.productBrandId = newBrand.id;
        myanmarBrandLocalize.productBrandId = newBrand.id;

        this.productBrandLocalizeService.create(englishBrandLocalize).subscribe();
        this.productBrandLocalizeService.create(myanmarBrandLocalize).subscribe();

      });
    });
  }

  openFile(contentType, field): any {
    return this.dataUtils.openFile(contentType, field);
  }

  onCompletedImport(): void {
    // this.showImportCompleted = false;
    this.router.navigate(['/main/products/manage-products']);
  }

  selectedChanged(event) {
    console.log(event);
  }

  getEnglishCulture(): ICulture {
    return this.cultures?.find(x => x.code === 'en');
  }

  getMyanmarCulture(): ICulture {
    return this.cultures?.find(x => x.code === 'my');
  }

  ngOnDestroy(): void {
    this.clearUploadedRecords();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected onImportError(err): void {
    this.isImported = false;
    // this.rootAlertService.setMessage('File import failed', 'danger');
  }

  protected onError(errorMessage: string): void {
    console.log('errorMessage', errorMessage);
    this.errorVisible = true;
    this.loading = false;
    this.errorMessage = errorMessage;
    this.jhiAlertService.error(errorMessage, null, null);
  }
}

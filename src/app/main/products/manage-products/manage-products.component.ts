import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { filter, map, debounceTime, tap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IStockItems, AlertType, Alerts, IAlerts } from '@vertical/models';
import { StockItemsService, ProductsService } from '@vertical/services';
import { AccountService } from '@vertical/core';
import { ITEMS_PER_PAGE } from '@vertical/constants';
import { ErrorHandler } from '@vertical/utils/error.handler';
import { NzTableQueryParams } from 'ng-zorro-antd/table/public-api';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  account: any;
  stockItems: IStockItems[];
  currentStockItem: IStockItems;
  error: any;
  success: any;
  eventSubscriber: Subscription;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  selectedMode = 0;
  loading = true;
  statistics: any;

  filterType = 0;
  showAlertInd = false;
  alert: IAlerts = new Alerts();
  activeLoading = false;

  constructor(
    protected stockItemsService: StockItemsService,
    protected parseLinks: JhiParseLinks,
    protected jhiAlertService: JhiAlertService,
    protected accountService: AccountService,
    protected productsService: ProductsService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected eventManager: JhiEventManager,
    private msg: NzMessageService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.accountService.identity().pipe(
      map(account => {
        this.account = account;
      })
    );

    this.registerChangeInStockItems();
  }

  loadAll(): void {
    const options = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: this.sort(),
    };

    if (this.filterType === 1) {
      Object.assign(options, {
        'activeInd.equals': true,
      });
    }

    if (this.filterType === 2) {
      Object.assign(options, {
        'quantityOnHand.equals': 0,
      });
    }

    if (this.filterType === 3) {
      Object.assign(options, {
        'activeInd.equals': false,
      });
    }

    console.log('options', options);
    this.stockItemsService.findAll(options).subscribe(
      (res: any) => {
        this.statistics = JSON.parse(res.headers.get('Extra'));
        console.log('stock items', res, this.statistics);
        return this.paginateStockItems(res.body, res.headers);
      },
      (res: HttpErrorResponse) => this.onError(res)
    );
  }

  loadPage(page: number): void {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition(): void {
    this.router.navigate(['/products/manage-products'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    });
    this.loadAll();
  }

  showAlert(type: AlertType, message: string): void {
    this.alert.message = message;
    this.alert.type = type;
    this.showAlertInd = true;
  }

  clear(): void {
    this.page = 0;
    this.router.navigate([
      '/products/manage-products',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    ]);
    this.loadAll();
  }

  updateStockItemActive(event): void {
    console.log('update', event);
    this.activeLoading = true;
    this.subscribeToUpdateStockItemActiveResponse(this.stockItemsService.update(event));
  }

  onUpdateStockItemActiveSuccess(res): void {
    this.activeLoading = false;
    this.msg.success(res.body.name + ' has been sucessfully ' + (res.body.activeInd ? 'active' : 'inactive'));
  }

  onUpdateStockItemActiveError(res): void {
    console.log('error', res);
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IStockItems): number {
    return item.id;
  }

  registerChangeInStockItems(): void {
    this.eventSubscriber = this.eventManager.subscribe('stockItemsListModification', response => this.loadAll());
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;

    this.loading = true;
    this.itemsPerPage = pageSize;
    this.page = pageIndex;
    this.loadPage(this.page);
  }

  triggerPopover() {
    console.log('event');
  }

  changePopover(item, view) {
    if (view) {
      this.currentStockItem = item;
    }
  }

  onDelete(event): void {
    console.log('on delete', event);
  }

  selectedChanged(event) {
    this.filterType = event;
    this.loadAll();
  }

  protected subscribeToUpdateStockItemActiveResponse(result: Observable<HttpResponse<any>>): void {
    result.subscribe(
      (res: HttpResponse<any>) => this.onUpdateStockItemActiveSuccess(res),
      (err: HttpErrorResponse) => this.onUpdateStockItemActiveError(err)
    );
  }

  protected paginateStockItems(data: IStockItems[], headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.stockItems = data;
    this.loading = false;

    console.log(this.totalItems, this.stockItems, this.links);
  }

  protected onError(error: HttpErrorResponse): void {
    this.loading = false;
    this.msg.error(ErrorHandler.getErrorMessage(error));
  }
}

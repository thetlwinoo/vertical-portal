import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ITEMS_PER_PAGE } from '@vertical/constants';
import { Subscription } from 'rxjs';
import { IOrders, IAlerts, Alerts } from '@vertical/models';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { OrdersService } from '@vertical/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  orders?: IOrders[];
  loading: boolean;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  showAlertInd = false;
  alert: IAlerts = new Alerts();
  filterType = 0;
  date = null;
  dateRange = [];

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor(
    protected ordersService: OrdersService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager,
    protected modalService: NzModalService
  ) { }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    this.ordersService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IOrders[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      this.ngbPaginationPage = data.pagingParams.page;
      this.loadPage();
    });
    this.handleBackNavigation();
    this.registerChangeInOrders();
  }

  handleBackNavigation(): void {
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      const prevPage = params.get('page');
      const prevSort = params.get('sort');
      const prevSortSplit = prevSort?.split(',');
      if (prevSortSplit) {
        this.predicate = prevSortSplit[0];
        this.ascending = prevSortSplit[1] === 'asc';
      }
      if (prevPage && +prevPage !== this.page) {
        this.ngbPaginationPage = +prevPage;
        this.loadPage(+prevPage);
      } else {
        this.loadPage(this.page);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrders): number {
    // tslint:disable-next-line: no-non-null-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInOrders(): void {
    this.eventSubscriber = this.eventManager.subscribe('ordersListModification', () => this.loadPage());
  }

  // delete(orders: IOrders): void {
  //   const modalRef = this.modalService.open(OrdersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
  //   modalRef.componentInstance.orders = orders;
  // }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  selectedChanged(index) {
    this.filterType = index;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  onAllChecked(checked: boolean): void {

  }

  onItemChecked(id: number, checked: boolean): void {

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

  protected onSuccess(data: IOrders[] | null, headers: HttpHeaders, page: number): void {
    this.loading = false;
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/orders/manage-orders'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });

    data.map(item => {
      item.orderDetails = JSON.parse(item.orderDetails);
    });

    this.orders = data || [];
    console.log(this.orders);
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }

}

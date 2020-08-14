import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICustomers } from '@vertical/models';
import { Subscription, Subject } from 'rxjs';
import { CustomersService } from '@vertical/services';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ITEMS_PER_PAGE } from '@vertical/constants';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DATE_TIME_FORMAT, SERVER_API_URL } from '@vertical/constants';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers?: ICustomers[];
  eventSubscriber?: Subscription;
  confirmModal?: NzModalRef;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  nzPaginationPage = 1;

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected customersService: CustomersService,
    protected eventManager: JhiEventManager,
    private modal: NzModalService,
    protected dataUtils: JhiDataUtils,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) { }

  loadPage(page?: number): void {
    const pageToLoad: number = page || this.page;

    this.customersService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICustomers[]>) => this.onSuccess(res.body, res.headers, pageToLoad),
        () => this.onError()
      );
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.ascending = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      this.nzPaginationPage = data.pagingParams.page;
    });
    this.handleBackNavigation();
    this.registerChangeInCustomers();
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
        this.nzPaginationPage = +prevPage;
        this.loadPage(+prevPage);
      } else {
        this.loadPage(this.page);
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;

    this.page = pageIndex;
    this.loadPage(this.page);
  }

  trackId(index: number, item: ICustomers): number {
    // tslint:disable-next-line: no-non-null-assertion
    return item.id!;
  }

  registerChangeInCustomers(): void {
    this.eventSubscriber = this.eventManager.subscribe('customersListModification', () => this.loadPage());
  }

  deleteConfirm(customers: ICustomers): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this customer?',
      nzContent: 'When clicked the OK button, customer will be deleted from the system',
      nzOnOk: () =>
        this.customersService.delete(customers.id).subscribe(() => {
          this.eventManager.broadcast('customersListModification');
        })
    });
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: ICustomers[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.router.navigate(['/main/store/customers'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });
    this.customers = data || [];
  }

  protected onError(): void {
    this.nzPaginationPage = this.page;
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

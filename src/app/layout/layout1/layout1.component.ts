import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AccountService, AuthService, StateStorageService } from '@vertical/core';
// import { Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Account } from '@vertical/core/user/account.model';
import { navigation } from 'app/navigation/navigation';
import { VsConfigService } from '@vertical/services';
import { takeUntil } from 'rxjs/operators';
import { ISuppliers } from '@vertical/models';
import { select, Store } from '@ngrx/store';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { SupplierActions } from 'app/ngrx/auth/actions';

type SelectableEntity = ISuppliers;

@Component({
  selector: 'app-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss'],
})
export class Layout1Component implements OnInit, OnDestroy {
  pageTitle: string;
  account: Account;
  isCollapsed = false;
  navigation: any;
  vsConfig: any;
  suppliers$: Observable<ISuppliers[]>;
  suppliers: ISuppliers[];
  selectedSupplier$: Observable<ISuppliers>;
  selectedSupplier: ISuppliers;


  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private vsConfigService: VsConfigService,
    private accountService: AccountService,
    private authService: AuthService,
    private store: Store<fromAuth.State>,
    private stateStorageService: StateStorageService
  ) {
    this.suppliers$ = this.store.pipe(select(fromAuth.getSuppliersFetched));
    this.selectedSupplier$ = this.store.pipe(select(fromAuth.getSupplierSelected));
  }

  ngOnInit(): void {
    this.navigation = navigation;


    this.accountService.identity().subscribe(account => (this.account = account));

    this.vsConfigService.config.pipe(takeUntil(this.unsubscribe$)).subscribe(config => {
      this.vsConfig = config;
      console.log('layout config', this.vsConfig);
    });

    this.suppliers$.subscribe(suppliers => {
      this.suppliers = suppliers;
      const storeSupplierId = this.stateStorageService.getSupplier();
      const storeSupplier = suppliers.find(x => x.id === storeSupplierId);
      this.store.dispatch(SupplierActions.selectSupplier({ supplier: storeSupplier }));
    });
    this.selectedSupplier$.subscribe(selectedSupplier => (this.selectedSupplier = selectedSupplier));
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  onOpenChanged(event): void {
    console.log('open', event);
  }

  onChangeSupplier(event): void {
    this.stateStorageService.storeSupplier(event.id);
    this.store.dispatch(SupplierActions.selectSupplier({ supplier: event }));
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

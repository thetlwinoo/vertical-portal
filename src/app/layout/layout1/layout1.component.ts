import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AccountService, AuthService } from '@vertical/core';
// import { Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Account } from '@vertical/core/user/account.model';
import { navigation } from 'app/navigation/navigation';
import { VsConfigService } from '@vertical/services';
import { takeUntil } from 'rxjs/operators';

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

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private vsConfigService: VsConfigService,
    private accountService: AccountService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.navigation = navigation;
    this.accountService.identity().subscribe(account => (this.account = account));

    this.vsConfigService.config.pipe(takeUntil(this.unsubscribe$)).subscribe(config => {
      this.vsConfig = config;
      console.log('layout config', this.vsConfig);
    });

  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

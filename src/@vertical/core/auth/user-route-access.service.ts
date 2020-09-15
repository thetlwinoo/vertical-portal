import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from '@vertical/core/auth/account.service';
import { AuthService } from '@vertical/core/auth/auth.service';
import { StateStorageService } from './state-storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private msg: NzMessageService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const authorities = route.data.authorities;
    return this.checkLogin(authorities, state.url);
  }

  checkLogin(authorities: string[], url: string): Observable<boolean> {
    return this.accountService.identity().pipe(
      map(account => {
        if (!authorities || authorities.length === 0) {
          return true;
        }

        if (account) {
          const hasAnyAuthority = this.accountService.hasAnyAuthority(authorities);
          if (hasAnyAuthority) {
            return true;
          }
          if (isDevMode()) {
            console.error('User has not any of required authorities: ', authorities);
          }
          // this.router.navigate(['accessdenied']);
          this.msg.error('User has not any of required authorities: ' + authorities);
          return false;
        }

        this.stateStorageService.storeUrl(url);
        this.authService.login();
        return false;
      })
    );
  }
}

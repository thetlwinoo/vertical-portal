import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { VsConfigService, TranslationLoaderService } from '@vertical/services';
// import { locale as navigationEnglish } from 'app/navigation/i18n/en';
// import { locale as navigationMyanmar } from 'app/navigation/i18n/mm';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAuth from 'app/ngrx/auth/reducers';
import { SupplierActions } from 'app/ngrx/auth/actions';
import { AccountService } from '@vertical/core';
import { SplashScreenService } from '@vertical/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  account: Account;

  constructor(
    // private translateService: TranslateService, 
    // private translationLoaderService: TranslationLoaderService,
    private store: Store<fromAuth.State>,
    private accountService: AccountService,
    private splashScreenService: SplashScreenService
  ) {
    this.accountService.identity().subscribe((account) => {
      if (account) {
        this.store.dispatch(SupplierActions.fetchSuppliers({ query: null }));
      }
    });


    // this.translateService.addLangs(['en', 'mm']);
    // this.translateService.setDefaultLang('en');
    // this.translationLoaderService.loadTranslations(navigationEnglish, navigationMyanmar);
    // this.translateService.use('en');
  }
}

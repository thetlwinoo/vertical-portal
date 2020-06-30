import { NgModule, LOCALE_ID } from '@angular/core';
// import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { CookieModule } from 'ngx-cookie';
import { TranslateModule } from '@ngx-translate/core';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgJhipsterModule, JhiLanguageService } from 'ng-jhipster';
// import locale from '@angular/common/locales/en';
// import * as moment from 'moment';
// import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
// import { NgbDateMomentAdapter } from '@vertical/utils/datepicker-adapter';
// import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { fontAwesomeIcons } from './icons/font-awesome-icons';

import { HttpRequestInterceptor, AuthExpiredInterceptor, ErrorHandlerInterceptor, NotificationInterceptor } from '@vertical/blocks/interceptor';

@NgModule({
  imports: [
    HttpClientModule,
    CookieModule.forRoot(),
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    NgJhipsterModule.forRoot({
      alertAsToast: false,
      alertTimeout: 5000,
      i18nEnabled: true,
      defaultI18nLang: 'en',
    }),
    TranslateModule.forRoot(),
  ],
  providers: [
    Title,
    // {
    //   provide: LOCALE_ID,
    //   useValue: 'en',
    // },
    // { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter },
    // DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(
    // iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig, languageService: JhiLanguageService
  ) {
    // registerLocaleData(locale);
    // iconLibrary.addIcons(...fontAwesomeIcons);
    // dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    // languageService.init();
  }
}

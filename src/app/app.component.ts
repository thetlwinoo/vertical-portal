import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { VsConfigService, TranslationLoaderService } from '@vertical/services';
// import { locale as navigationEnglish } from 'app/navigation/i18n/en';
// import { locale as navigationMyanmar } from 'app/navigation/i18n/mm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    // private translateService: TranslateService, 
    // private translationLoaderService: TranslationLoaderService, 
  ) {
    // this.translateService.addLangs(['en', 'mm']);
    // this.translateService.setDefaultLang('en');
    // this.translationLoaderService.loadTranslations(navigationEnglish, navigationMyanmar);
    // this.translateService.use('en');
  }
}

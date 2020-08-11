import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgJhipsterModule } from 'ng-jhipster';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { VsDirectivesModule } from '@vertical/directives/directives';
import { VsPipesModule } from '@vertical/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { NgPipesModule } from 'ngx-pipes';
import { NgZorroAntdModule, PrimeNgModule } from '@vertical/modules';

@NgModule({
    exports: [
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        PrimeNgModule,
        CommonModule,
        NgJhipsterModule,
        NgxPicaModule,
        VsPipesModule,
        VsDirectivesModule,
        TranslateModule,
        NgPipesModule,
    ],
    providers: [],
})
export class VsSharedLibsModule { }

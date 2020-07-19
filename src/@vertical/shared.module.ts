import { NgModule } from '@angular/core';

import { VsSharedLibsModule } from './shared-libs.module';
import { VS_COMPONENTS } from './components';

@NgModule({
    imports: [VsSharedLibsModule],
    declarations: [...VS_COMPONENTS],
    providers: [],
    exports: [VsSharedLibsModule, ...VS_COMPONENTS],
})
export class VsSharedModule { }

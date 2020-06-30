import { NgModule } from '@angular/core';

import { HasAnyAuthorityDirective } from '@vertical/directives/auth/has-any-authority.directive';

@NgModule({
    declarations: [
        HasAnyAuthorityDirective,
    ],
    imports: [],
    exports: [
        HasAnyAuthorityDirective,
    ],
})
export class VsDirectivesModule { }

import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { VS_CONFIG } from '@vertical/services';

@NgModule()
export class VerticalModule {
    constructor(@Optional() @SkipSelf() parentModule: VerticalModule) {
        if (parentModule) {
            throw new Error('VerticalModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forRoot(config): ModuleWithProviders<VerticalModule> {
        return {
            ngModule: VerticalModule,
            providers: [
                {
                    provide: VS_CONFIG,
                    useValue: config,
                },
            ],
        };
    }
}

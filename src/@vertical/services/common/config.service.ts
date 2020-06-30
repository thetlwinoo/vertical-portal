import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';

export const VS_CONFIG = new InjectionToken('vsCustomConfig');

@Injectable({
    providedIn: 'root',
})
export class VsConfigService {
    private configSubject: BehaviorSubject<any>;
    private readonly lDefaultConfig: any;

    constructor(private platform: Platform, private router: Router, @Inject(VS_CONFIG) private pConfig) {
        this.lDefaultConfig = pConfig;
        this._init();
    }

    set config(value) {
        let config = this.configSubject.getValue();
        config = _.merge({}, config, value);
        this.configSubject.next(config);
    }

    get config(): any | Observable<any> {
        return this.configSubject.asObservable();
    }

    get defaultConfig(): any {
        return this.lDefaultConfig;
    }

    setConfig(value, opts = { emitEvent: true }): void {
        let config = this.configSubject.getValue();

        config = _.merge({}, config, value);

        if (opts.emitEvent === true) {
            this.configSubject.next(config);
        }
    }

    getConfig(): Observable<any> {
        return this.configSubject.asObservable();
    }

    resetToDefaults(): void {
        this.configSubject.next(_.cloneDeep(this.defaultConfig));
    }

    private _init(): void {
        if (this.platform.ANDROID || this.platform.IOS) {
            this.defaultConfig.customScrollbars = false;
        }

        this.configSubject = new BehaviorSubject(_.cloneDeep(this.defaultConfig));

        this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe(() => {
            if (!_.isEqual(this.configSubject.getValue().layout, this.defaultConfig.layout)) {
                const config = _.cloneDeep(this.configSubject.getValue());

                config.layout = _.cloneDeep(this.defaultConfig.layout);

                this.configSubject.next(config);
            }
        });
    }
}

import { Component, ViewEncapsulation, HostBinding, Input, TemplateRef } from '@angular/core';
import { IAlerts } from '@vertical/models';

@Component({
    selector: 'vs-alert',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VSAlertsComponent {
    @HostBinding('class') class = 'vs-alert';

    @Input() alert: IAlerts;

    constructor() { }
}

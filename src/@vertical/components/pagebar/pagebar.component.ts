import { Component, ViewEncapsulation, HostBinding, Input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'vs-pagebar',
    templateUrl: './pagebar.component.html',
    styleUrls: ['./pagebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VSPagebarComponent {
    @HostBinding('class') class = 'vs-pagebar';

    @Input() title: string | TemplateRef<any>;
    @Input() subtitle: string | TemplateRef<any>;
    @Input() backUrl: string;

    constructor() { }

    onBack(): void {
        console.log('onBack');
    }
}

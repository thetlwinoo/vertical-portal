import { Component, ChangeDetectionStrategy, TemplateRef, Input, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vs-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VSPanelComponent {
  @HostBinding('class') class = 'vs-panel';

  @Input() title: string | TemplateRef<any>;
}

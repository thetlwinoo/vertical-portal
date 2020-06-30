import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { VsSharedModule } from '@vertical/shared.module';
import { WelcomeComponent } from './welcome.component';
import { WelcomeTopbarComponent } from './components/welcome-topbar/welcome-topbar.component';

const COMPONENT = [WelcomeComponent, WelcomeTopbarComponent];

@NgModule({
  imports: [WelcomeRoutingModule, VsSharedModule],
  declarations: [...COMPONENT],
  exports: [...COMPONENT]
})
export class WelcomeModule { }

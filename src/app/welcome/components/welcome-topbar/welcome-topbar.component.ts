import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-welcome-topbar',
  templateUrl: './welcome-topbar.component.html',
  styleUrls: ['./welcome-topbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeTopbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VsConfigService } from '@vertical/services';
import { vsAnimations } from '@vertical/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: vsAnimations,
})
export class WelcomeComponent implements OnInit {
  bigImage = '';
  type = 'user';
  error = '';
  form: FormGroup;
  tabs = [
    {
      title: 'Email Sign-in'
    },
    {
      title: 'Phone Sign-in'
    }
  ];

  constructor(
    private vsConfigService: VsConfigService,
    fb: FormBuilder,
    private msg: NzMessageService,
    private router: Router,
  ) {
    this.vsConfigService.config = {
      layout: {
        alert: {
          hidden: true,
        },
        header: {
          hidden: true,
        },
        subnav: {
          hidden: true,
        },
        sidenav: {
          hidden: true,
        },
        toolbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        sidepanel: {
          hidden: true,
        },
      },
    };

    this.form = fb.group({
      userName: [null, [Validators.required, Validators.pattern(/^(admin|user)$/)]],
      password: [null, [Validators.required, Validators.pattern(/^ng\-alain\.com$/)]],
    });
  }

  get password() {
    return this.form.controls.password;
  }

  get userName() {
    return this.form.controls.userName;
  }

  t() {
    this.msg.info('info');
  }

  ngOnInit() {
  }

  login(): void {
    this.router.navigate(['/products/manage-products']);
  }
}

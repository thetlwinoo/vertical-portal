import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatementsComponent } from './account-statements.component';

describe('AccountStatementsComponent', () => {
  let component: AccountStatementsComponent;
  let fixture: ComponentFixture<AccountStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

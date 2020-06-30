import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReturnOrdersComponent } from './manage-return-orders.component';

describe('ManageReturnOrdersComponent', () => {
  let component: ManageReturnOrdersComponent;
  let fixture: ComponentFixture<ManageReturnOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReturnOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReturnOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

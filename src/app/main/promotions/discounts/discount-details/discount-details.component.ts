/* tslint:disable */
import { Component, OnInit, OnDestroy, Input, ViewContainerRef, OnChanges } from '@angular/core';
import { IDiscountDetails, DiscountDetails, IDiscounts } from '@vertical/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, Subject } from 'rxjs';
import { DiscountDetailsService } from '@vertical/services';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { JhiEventManager } from 'ng-jhipster';
import { SERVER_API_URL } from '@vertical/constants';
import { DiscountDetailsViewEditComponent } from './discount-details-view-edit/discount-details-view-edit.component';
import { DiscountsModule } from '../discounts.module';

@Component({
  selector: 'app-discount-details',
  templateUrl: './discount-details.component.html',
  styleUrls: ['./discount-details.component.scss']
})
export class DiscountDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() discounts: IDiscounts;

  discountDetails: IDiscountDetails[];
  confirmModal?: NzModalRef;
  eventSubscriber?: Subscription;
  selectedDiscountDetails: IDiscountDetails;

  public blobUrl = SERVER_API_URL + 'services/cloudblob/api/images-extend/';

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    protected discountDetailsService: DiscountDetailsService,
    private modal: NzModalService,
    private msg: NzMessageService,
    protected eventManager: JhiEventManager,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    this.registerChangeInDiscountDetails();
  }

  ngOnChanges(): void {
    if (this.discounts) {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.discountDetailsService
      .query({
        'discountId.equals': this.discounts.id
      })
      .subscribe(
        (res: HttpResponse<IDiscountDetails[]>) => (this.discountDetails = res.body || []),
        (error) => this.msg.error(error)
      );
  }

  registerChangeInDiscountDetails(): void {
    this.eventSubscriber = this.eventManager.subscribe('discountDetailsModification', () => this.loadAll());
  }

  deleteConfirm(discountDetails: IDiscountDetails): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this discounts?',
      nzContent: 'When clicked the OK button, discounts will be deleted from the system',
      nzOnOk: () =>
        this.discountDetailsService.delete(discountDetails.id).subscribe(() => {
          this.eventManager.broadcast('discountDetailsModification');
        })
    });
  }

  createNewDiscountDetails() {
    const discountDetails = new DiscountDetails();
    discountDetails.discountId = this.discounts.id;
    discountDetails.name = this.discounts.name;
    this.createDiscountDetailsModel(discountDetails);
  }

  createDiscountDetailsModel(discountDetails: IDiscountDetails) {
    this.modal.create({
      nzTitle: discountDetails.id ? 'Edit Discount Details' : 'Add Discount Details',
      nzWidth: 1080,
      nzContent: DiscountDetailsViewEditComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: { discountDetails },
      nzClosable: false,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: [
        {
          label: 'Save',
          type: 'primary',
          disabled: componentInstance => {
            return componentInstance!.editForm.invalid;
          },
          onClick: componentInstance => {
            componentInstance.save();
            componentInstance!.destroyModal();
          }
        },
        {
          label: 'Cancel',
          onClick: componentInstance => {
            componentInstance!.destroyModal();
          }
        }
      ]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

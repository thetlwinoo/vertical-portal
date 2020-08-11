import { Component, OnInit, OnDestroy } from '@angular/core';
import { IProductChoice, ProductChoice, IProductCategory, IProductAttributeSet, IProductOptionSet } from '@vertical/models';
import { Subscription } from 'rxjs';
import { ProductChoiceService } from '@vertical/services';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-product-choice',
  templateUrl: './product-choice.component.html',
  styleUrls: ['./product-choice.component.scss']
})
export class ProductChoiceComponent implements OnInit, OnDestroy {
  productChoices?: IProductChoice[];
  eventSubscriber?: Subscription;
  confirmModal?: NzModalRef;

  constructor(
    protected productChoiceService: ProductChoiceService,
    protected eventManager: JhiEventManager,
    private modal: NzModalService,
  ) { }

  loadAll(): void {
    this.productChoiceService.query().subscribe((res: HttpResponse<IProductChoice[]>) => (this.productChoices = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInProductChoices();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IProductChoice): number {
    // tslint:disable-next-line: no-non-null-assertion
    return item.id!;
  }

  registerChangeInProductChoices(): void {
    this.eventSubscriber = this.eventManager.subscribe('productChoiceListModification', () => this.loadAll());
  }

  delete(productChoice: IProductChoice): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this product choice?',
      nzContent: 'When clicked the OK button, product choice will be deleted from the system',
      nzOnOk: () =>
        this.productChoiceService.delete(productChoice.id).subscribe(() => {
          this.eventManager.broadcast('productChoiceListModification');
        })
    });
  }

}

/* tslint:disable */
import { Component, OnInit } from '@angular/core';
import { IPeople } from '@vertical/models';
import { Subscription, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { JhiEventManager } from 'ng-jhipster';
import { PeopleService } from '@vertical/services';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  people?: IPeople[];
  eventSubscriber?: Subscription;
  confirmModal?: NzModalRef;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(protected peopleService: PeopleService, protected eventManager: JhiEventManager, private modal: NzModalService,) { }

  loadAll(): void {
    this.peopleService.query().subscribe((res: HttpResponse<IPeople[]>) => (this.people = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPeople();
  }

  trackId(index: number, item: IPeople): number {
    return item.id!;
  }

  registerChangeInPeople(): void {
    this.eventSubscriber = this.eventManager.subscribe('peopleListModification', () => this.loadAll());
  }

  deleteConfirm(people: IPeople): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this user?',
      nzContent: 'When clicked the OK button, user will be deleted from the system',
      nzOnOk: () =>
        this.peopleService.delete(people.id).subscribe(() => {
          this.eventManager.broadcast('peopleListModification');
        })
    });
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

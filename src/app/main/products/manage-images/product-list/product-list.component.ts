import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { vsAnimations } from '@vertical/animations';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, of, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { StockItemsService, PhotosService } from '@vertical/services';
import { ImageUtils } from '@vertical/services';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: vsAnimations
})
export class ProductListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingFeeChartComponent } from './shipping-fee-chart.component';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';

export const shoppingFeeChartRoute: Routes = [
  {
    path: '',
    component: ShippingFeeChartComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: [Authority.PORTAL],
      defaultSort: 'id,asc',
      pageTitle: 'Manage Store',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create',
    component: ShippingFeeChartComponent,
    // resolve: {

    // },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Supplier Add',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'edit/:id',
    component: ShippingFeeChartComponent,
    // resolve: {

    // },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Supplier Edit',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'view/:id',
    component: ShippingFeeChartComponent,
    // resolve: {

    // },
    data: {
      authorities: [Authority.PORTAL],
      pageTitle: 'Supplier View',
    },
    canActivate: [UserRouteAccessService],
  },
];

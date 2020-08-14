import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { ICustomers, Customers } from '@vertical/models';
import { CustomersService } from '@vertical/services';
import { CustomersComponent } from './customers.component';
import { CustomerViewEditComponent } from './customer-view-edit/customer-view-edit.component';
import { CustomerAddComponent } from './customer-add/customer-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class CustomersResolve implements Resolve<ICustomers> {
    constructor(private service: CustomersService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ICustomers> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((customers: HttpResponse<Customers>) => {
                    if (customers.body) {
                        return of(customers.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Customers());
    }
}

export const customersRoute: Routes = [
    {
        path: '',
        component: CustomersComponent,
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
        component: CustomerAddComponent,
        resolve: {
            customers: CustomersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Customer Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'edit/:id',
        component: CustomerViewEditComponent,
        resolve: {
            customers: CustomersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Customer Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'view/:id',
        component: CustomerViewEditComponent,
        resolve: {
            customers: CustomersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Customer View',
        },
        canActivate: [UserRouteAccessService],
    },
];

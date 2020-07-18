import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { IAddresses, Addresses } from '@vertical/models';
import { AddressesService } from '@vertical/services';
import { AddressesComponent } from './addresses.component';
import { AddressViewEditComponent } from './address-view-edit/address-view-edit.component';
import { AddressAddComponent } from './address-add/address-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class AddressesResolve implements Resolve<IAddresses> {
    constructor(private service: AddressesService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IAddresses> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((addresses: HttpResponse<Addresses>) => {
                    if (addresses.body) {
                        return of(addresses.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Addresses());
    }
}

export const addressesRoute: Routes = [
    {
        path: '',
        component: AddressesComponent,
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
        component: AddressAddComponent,
        resolve: {
            addresses: AddressesResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Address Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'edit/:id',
        component: AddressViewEditComponent,
        resolve: {
            addresses: AddressesResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Address Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'view/:id',
        component: AddressViewEditComponent,
        resolve: {
            addresses: AddressesResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Address View',
        },
        canActivate: [UserRouteAccessService],
    },
];

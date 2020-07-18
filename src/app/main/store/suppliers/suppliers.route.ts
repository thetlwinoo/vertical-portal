import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { ISuppliers, Suppliers } from '@vertical/models';
import { SuppliersService } from '@vertical/services';
import { SuppliersComponent } from './suppliers.component';
import { SupplierViewEditComponent } from './supplier-view-edit/supplier-view-edit.component';
import { SupplierAddComponent } from './supplier-add/supplier-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class SuppliersResolve implements Resolve<ISuppliers> {
    constructor(private service: SuppliersService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ISuppliers> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((suppliers: HttpResponse<Suppliers>) => {
                    if (suppliers.body) {
                        return of(suppliers.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new Suppliers());
    }
}

export const suppliersRoute: Routes = [
    {
        path: '',
        component: SuppliersComponent,
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
        component: SupplierAddComponent,
        resolve: {
            suppliers: SuppliersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Supplier Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'edit/:id',
        component: SupplierViewEditComponent,
        resolve: {
            suppliers: SuppliersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Supplier Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'view/:id',
        component: SupplierViewEditComponent,
        resolve: {
            suppliers: SuppliersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'Supplier View',
        },
        canActivate: [UserRouteAccessService],
    },
];

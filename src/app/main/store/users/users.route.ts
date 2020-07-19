import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from '@vertical/constants';
import { UserRouteAccessService } from '@vertical/core';
import { IPeople, People } from '@vertical/models';
import { PeopleService } from '@vertical/services';
import { UsersComponent } from './users.component';
import { UserViewEditComponent } from './user-view-edit/user-view-edit.component';
import { UserAddComponent } from './user-add/user-add.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

@Injectable({ providedIn: 'root' })
export class UsersResolve implements Resolve<IPeople> {
    constructor(private service: PeopleService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<IPeople> | Observable<never> {
        const id = route.params.id;
        if (id) {
            return this.service.find(id).pipe(
                flatMap((res: HttpResponse<IPeople>) => {
                    if (res.body) {
                        return of(res.body);
                    } else {
                        this.router.navigate(['404']);
                        return EMPTY;
                    }
                })
            );
        }
        return of(new People());
    }
}

export const usersRoute: Routes = [
    {
        path: '',
        component: UsersComponent,
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
        component: UserAddComponent,
        resolve: {
            people: UsersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'User Add',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'edit/:id',
        component: UserViewEditComponent,
        resolve: {
            people: UsersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'User Edit',
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: 'view/:id',
        component: UserViewEditComponent,
        resolve: {
            people: UsersResolve,
        },
        data: {
            authorities: [Authority.PORTAL],
            pageTitle: 'User View',
        },
        canActivate: [UserRouteAccessService],
    },
];

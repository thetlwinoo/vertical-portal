import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IPeople } from '@vertical/models';

type EntityResponseType = HttpResponse<IPeople>;
type EntityArrayResponseType = HttpResponse<IPeople[]>;

@Injectable({ providedIn: 'root' })
export class PeopleService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/people';

    constructor(protected http: HttpClient) { }

    create(people: IPeople): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(people);
        return this.http
            .post<IPeople>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(people: IPeople): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(people);
        return this.http
            .put<IPeople>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPeople>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPeople[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(people: IPeople): IPeople {
        const copy: IPeople = Object.assign({}, people, {
            dateOfBirth: people.dateOfBirth && people.dateOfBirth.isValid() ? people.dateOfBirth.toJSON() : undefined,
            validFrom: people.validFrom && people.validFrom.isValid() ? people.validFrom.toJSON() : undefined,
            validTo: people.validTo && people.validTo.isValid() ? people.validTo.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.dateOfBirth = res.body.dateOfBirth ? moment(res.body.dateOfBirth) : undefined;
            res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
            res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((people: IPeople) => {
                people.dateOfBirth = people.dateOfBirth ? moment(people.dateOfBirth) : undefined;
                people.validFrom = people.validFrom ? moment(people.validFrom) : undefined;
                people.validTo = people.validTo ? moment(people.validTo) : undefined;
            });
        }
        return res;
    }
}

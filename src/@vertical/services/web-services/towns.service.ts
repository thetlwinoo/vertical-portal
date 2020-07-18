import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ITowns } from '@vertical/models';

type EntityResponseType = HttpResponse<ITowns>;
type EntityArrayResponseType = HttpResponse<ITowns[]>;

@Injectable({ providedIn: 'root' })
export class TownsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/towns';

    constructor(protected http: HttpClient) { }

    create(towns: ITowns): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(towns);
        return this.http
            .post<ITowns>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(towns: ITowns): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(towns);
        return this.http
            .put<ITowns>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITowns>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITowns[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(towns: ITowns): ITowns {
        const copy: ITowns = Object.assign({}, towns, {
            validFrom: towns.validFrom && towns.validFrom.isValid() ? towns.validFrom.toJSON() : undefined,
            validTo: towns.validTo && towns.validTo.isValid() ? towns.validTo.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
            res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((towns: ITowns) => {
                towns.validFrom = towns.validFrom ? moment(towns.validFrom) : undefined;
                towns.validTo = towns.validTo ? moment(towns.validTo) : undefined;
            });
        }
        return res;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ITownships } from '@vertical/models';

type EntityResponseType = HttpResponse<ITownships>;
type EntityArrayResponseType = HttpResponse<ITownships[]>;

@Injectable({ providedIn: 'root' })
export class TownshipsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/townships';

    constructor(protected http: HttpClient) { }

    create(townships: ITownships): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(townships);
        return this.http
            .post<ITownships>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(townships: ITownships): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(townships);
        return this.http
            .put<ITownships>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITownships>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITownships[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(townships: ITownships): ITownships {
        const copy: ITownships = Object.assign({}, townships, {
            validFrom: townships.validFrom && townships.validFrom.isValid() ? townships.validFrom.toJSON() : undefined,
            validTo: townships.validTo && townships.validTo.isValid() ? townships.validTo.toJSON() : undefined,
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
            res.body.forEach((townships: ITownships) => {
                townships.validFrom = townships.validFrom ? moment(townships.validFrom) : undefined;
                townships.validTo = townships.validTo ? moment(townships.validTo) : undefined;
            });
        }
        return res;
    }
}

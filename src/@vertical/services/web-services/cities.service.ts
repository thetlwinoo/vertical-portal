import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ICities } from '@vertical/models';

type EntityResponseType = HttpResponse<ICities>;
type EntityArrayResponseType = HttpResponse<ICities[]>;

@Injectable({ providedIn: 'root' })
export class CitiesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/cities';

    constructor(protected http: HttpClient) { }

    create(cities: ICities): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(cities);
        return this.http
            .post<ICities>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(cities: ICities): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(cities);
        return this.http
            .put<ICities>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICities>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICities[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(cities: ICities): ICities {
        const copy: ICities = Object.assign({}, cities, {
            validFrom: cities.validFrom && cities.validFrom.isValid() ? cities.validFrom.toJSON() : undefined,
            validTo: cities.validTo && cities.validTo.isValid() ? cities.validTo.toJSON() : undefined,
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
            res.body.forEach((cities: ICities) => {
                cities.validFrom = cities.validFrom ? moment(cities.validFrom) : undefined;
                cities.validTo = cities.validTo ? moment(cities.validTo) : undefined;
            });
        }
        return res;
    }
}

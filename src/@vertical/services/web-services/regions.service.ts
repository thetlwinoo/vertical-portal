import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IRegions } from '@vertical/models';

type EntityResponseType = HttpResponse<IRegions>;
type EntityArrayResponseType = HttpResponse<IRegions[]>;

@Injectable({ providedIn: 'root' })
export class RegionsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/regions';

    constructor(protected http: HttpClient) { }

    create(regions: IRegions): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(regions);
        return this.http
            .post<IRegions>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(regions: IRegions): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(regions);
        return this.http
            .put<IRegions>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IRegions>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IRegions[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(regions: IRegions): IRegions {
        const copy: IRegions = Object.assign({}, regions, {
            validFrom: regions.validFrom && regions.validFrom.isValid() ? regions.validFrom.toJSON() : undefined,
            validTo: regions.validTo && regions.validTo.isValid() ? regions.validTo.toJSON() : undefined,
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
            res.body.forEach((regions: IRegions) => {
                regions.validFrom = regions.validFrom ? moment(regions.validFrom) : undefined;
                regions.validTo = regions.validTo ? moment(regions.validTo) : undefined;
            });
        }
        return res;
    }
}

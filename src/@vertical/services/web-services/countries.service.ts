import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ICountries } from '@vertical/models';

type EntityResponseType = HttpResponse<ICountries>;
type EntityArrayResponseType = HttpResponse<ICountries[]>;

@Injectable({ providedIn: 'root' })
export class CountriesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/countries';

    constructor(protected http: HttpClient) { }

    create(countries: ICountries): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(countries);
        return this.http
            .post<ICountries>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(countries: ICountries): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(countries);
        return this.http
            .put<ICountries>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICountries>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICountries[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(countries: ICountries): ICountries {
        const copy: ICountries = Object.assign({}, countries, {
            validFrom: countries.validFrom && countries.validFrom.isValid() ? countries.validFrom.toJSON() : undefined,
            validTo: countries.validTo && countries.validTo.isValid() ? countries.validTo.toJSON() : undefined,
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
            res.body.forEach((countries: ICountries) => {
                countries.validFrom = countries.validFrom ? moment(countries.validFrom) : undefined;
                countries.validTo = countries.validTo ? moment(countries.validTo) : undefined;
            });
        }
        return res;
    }
}

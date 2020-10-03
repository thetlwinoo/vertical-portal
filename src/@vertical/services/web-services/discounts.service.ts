import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IDiscounts } from '@vertical/models';

type EntityResponseType = HttpResponse<IDiscounts>;
type EntityArrayResponseType = HttpResponse<IDiscounts[]>;

@Injectable({ providedIn: 'root' })
export class DiscountsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/discounts';

    constructor(protected http: HttpClient) { }

    create(discounts: IDiscounts): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(discounts);
        return this.http
            .post<IDiscounts>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(discounts: IDiscounts): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(discounts);
        return this.http
            .put<IDiscounts>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IDiscounts>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDiscounts[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(discounts: IDiscounts): IDiscounts {
        const copy: IDiscounts = Object.assign({}, discounts, {
            validFrom: discounts.validFrom && discounts.validFrom.isValid() ? discounts.validFrom.toJSON() : undefined,
            validTo: discounts.validTo && discounts.validTo.isValid() ? discounts.validTo.toJSON() : undefined,
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
            res.body.forEach((discounts: IDiscounts) => {
                discounts.validFrom = discounts.validFrom ? moment(discounts.validFrom) : undefined;
                discounts.validTo = discounts.validTo ? moment(discounts.validTo) : undefined;
            });
        }
        return res;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IDiscountTypes } from '@vertical/models';

type EntityResponseType = HttpResponse<IDiscountTypes>;
type EntityArrayResponseType = HttpResponse<IDiscountTypes[]>;

@Injectable({ providedIn: 'root' })
export class DiscountTypesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/discount-types';

    constructor(protected http: HttpClient) { }

    create(discountTypes: IDiscountTypes): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(discountTypes);
        return this.http
            .post<IDiscountTypes>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(discountTypes: IDiscountTypes): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(discountTypes);
        return this.http
            .put<IDiscountTypes>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IDiscountTypes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDiscountTypes[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(discountTypes: IDiscountTypes): IDiscountTypes {
        const copy: IDiscountTypes = Object.assign({}, discountTypes, {
            modifiedDate: discountTypes.modifiedDate && discountTypes.modifiedDate.isValid() ? discountTypes.modifiedDate.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.modifiedDate = res.body.modifiedDate ? moment(res.body.modifiedDate) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((discountTypes: IDiscountTypes) => {
                discountTypes.modifiedDate = discountTypes.modifiedDate ? moment(discountTypes.modifiedDate) : undefined;
            });
        }
        return res;
    }
}

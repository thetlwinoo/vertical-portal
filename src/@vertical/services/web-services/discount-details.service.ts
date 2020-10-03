import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IDiscountDetails } from '@vertical/models';

type EntityResponseType = HttpResponse<IDiscountDetails>;
type EntityArrayResponseType = HttpResponse<IDiscountDetails[]>;

@Injectable({ providedIn: 'root' })
export class DiscountDetailsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/discount-details';

    constructor(protected http: HttpClient) { }

    create(discountDetails: IDiscountDetails): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(discountDetails);
        return this.http
            .post<IDiscountDetails>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(discountDetails: IDiscountDetails): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(discountDetails);
        return this.http
            .put<IDiscountDetails>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IDiscountDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDiscountDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(discountDetails: IDiscountDetails): IDiscountDetails {
        const copy: IDiscountDetails = Object.assign({}, discountDetails, {
            modifiedDate:
                discountDetails.modifiedDate && discountDetails.modifiedDate.isValid() ? discountDetails.modifiedDate.toJSON() : undefined,
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
            res.body.forEach((discountDetails: IDiscountDetails) => {
                discountDetails.modifiedDate = discountDetails.modifiedDate ? moment(discountDetails.modifiedDate) : undefined;
            });
        }
        return res;
    }
}

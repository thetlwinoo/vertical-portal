import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IOrderLines } from '@vertical/models';

type EntityResponseType = HttpResponse<IOrderLines>;
type EntityArrayResponseType = HttpResponse<IOrderLines[]>;

@Injectable({ providedIn: 'root' })
export class OrderLinesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/order-lines';

    constructor(protected http: HttpClient) { }

    create(orderLines: IOrderLines): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(orderLines);
        return this.http
            .post<IOrderLines>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(orderLines: IOrderLines): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(orderLines);
        return this.http
            .put<IOrderLines>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IOrderLines>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IOrderLines[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(orderLines: IOrderLines): IOrderLines {
        const copy: IOrderLines = Object.assign({}, orderLines, {
            pickingCompletedWhen:
                orderLines.pickingCompletedWhen && orderLines.pickingCompletedWhen.isValid() ? orderLines.pickingCompletedWhen.toJSON() : undefined,
            customerReviewedOn:
                orderLines.customerReviewedOn && orderLines.customerReviewedOn.isValid() ? orderLines.customerReviewedOn.toJSON() : undefined,
            supplierResponseOn:
                orderLines.supplierResponseOn && orderLines.supplierResponseOn.isValid() ? orderLines.supplierResponseOn.toJSON() : undefined,
            lastEditedWhen: orderLines.lastEditedWhen && orderLines.lastEditedWhen.isValid() ? orderLines.lastEditedWhen.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.pickingCompletedWhen = res.body.pickingCompletedWhen ? moment(res.body.pickingCompletedWhen) : undefined;
            res.body.customerReviewedOn = res.body.customerReviewedOn ? moment(res.body.customerReviewedOn) : undefined;
            res.body.supplierResponseOn = res.body.supplierResponseOn ? moment(res.body.supplierResponseOn) : undefined;
            res.body.lastEditedWhen = res.body.lastEditedWhen ? moment(res.body.lastEditedWhen) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((orderLines: IOrderLines) => {
                orderLines.pickingCompletedWhen = orderLines.pickingCompletedWhen ? moment(orderLines.pickingCompletedWhen) : undefined;
                orderLines.customerReviewedOn = orderLines.customerReviewedOn ? moment(orderLines.customerReviewedOn) : undefined;
                orderLines.supplierResponseOn = orderLines.supplierResponseOn ? moment(orderLines.supplierResponseOn) : undefined;
                orderLines.lastEditedWhen = orderLines.lastEditedWhen ? moment(orderLines.lastEditedWhen) : undefined;
            });
        }
        return res;
    }
}

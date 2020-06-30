import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IOrders } from '@vertical/models';

type EntityResponseType = HttpResponse<IOrders>;
type EntityArrayResponseType = HttpResponse<IOrders[]>;

@Injectable({ providedIn: 'root' })
export class OrdersService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/orders';

    constructor(protected http: HttpClient) { }

    create(orders: IOrders): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(orders);
        return this.http
            .post<IOrders>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(orders: IOrders): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(orders);
        return this.http
            .put<IOrders>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IOrders>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IOrders[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(orders: IOrders): IOrders {
        const copy: IOrders = Object.assign({}, orders, {
            orderDate: orders.orderDate && orders.orderDate.isValid() ? orders.orderDate.toJSON() : undefined,
            expectedDeliveryDate:
                orders.expectedDeliveryDate && orders.expectedDeliveryDate.isValid() ? orders.expectedDeliveryDate.toJSON() : undefined,
            pickingCompletedWhen:
                orders.pickingCompletedWhen && orders.pickingCompletedWhen.isValid() ? orders.pickingCompletedWhen.toJSON() : undefined,
            lastEditedWhen: orders.lastEditedWhen && orders.lastEditedWhen.isValid() ? orders.lastEditedWhen.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.orderDate = res.body.orderDate ? moment(res.body.orderDate) : undefined;
            res.body.expectedDeliveryDate = res.body.expectedDeliveryDate ? moment(res.body.expectedDeliveryDate) : undefined;
            res.body.pickingCompletedWhen = res.body.pickingCompletedWhen ? moment(res.body.pickingCompletedWhen) : undefined;
            res.body.lastEditedWhen = res.body.lastEditedWhen ? moment(res.body.lastEditedWhen) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((orders: IOrders) => {
                orders.orderDate = orders.orderDate ? moment(orders.orderDate) : undefined;
                orders.expectedDeliveryDate = orders.expectedDeliveryDate ? moment(orders.expectedDeliveryDate) : undefined;
                orders.pickingCompletedWhen = orders.pickingCompletedWhen ? moment(orders.pickingCompletedWhen) : undefined;
                orders.lastEditedWhen = orders.lastEditedWhen ? moment(orders.lastEditedWhen) : undefined;
            });
        }
        return res;
    }
}

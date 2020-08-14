import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IShippingFeeChart } from '@vertical/models';

type EntityResponseType = HttpResponse<IShippingFeeChart>;
type EntityArrayResponseType = HttpResponse<IShippingFeeChart[]>;

@Injectable({ providedIn: 'root' })
export class ShippingFeeChartService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/shipping-fee-charts';

    constructor(protected http: HttpClient) { }

    create(shippingFeeChart: IShippingFeeChart): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(shippingFeeChart);
        return this.http
            .post<IShippingFeeChart>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(shippingFeeChart: IShippingFeeChart): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(shippingFeeChart);
        return this.http
            .put<IShippingFeeChart>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IShippingFeeChart>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IShippingFeeChart[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(shippingFeeChart: IShippingFeeChart): IShippingFeeChart {
        const copy: IShippingFeeChart = Object.assign({}, shippingFeeChart, {
            lastEditedWhen:
                shippingFeeChart.lastEditedWhen && shippingFeeChart.lastEditedWhen.isValid() ? shippingFeeChart.lastEditedWhen.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.lastEditedWhen = res.body.lastEditedWhen ? moment(res.body.lastEditedWhen) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((shippingFeeChart: IShippingFeeChart) => {
                shippingFeeChart.lastEditedWhen = shippingFeeChart.lastEditedWhen ? moment(shippingFeeChart.lastEditedWhen) : undefined;
            });
        }
        return res;
    }
}

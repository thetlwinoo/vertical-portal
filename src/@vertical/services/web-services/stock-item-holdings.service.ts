import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IStockItemHoldings } from '@vertical/models';

type EntityResponseType = HttpResponse<IStockItemHoldings>;
type EntityArrayResponseType = HttpResponse<IStockItemHoldings[]>;

@Injectable({ providedIn: 'root' })
export class StockItemHoldingsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/stock-item-holdings';

    constructor(protected http: HttpClient) { }

    create(stockItemHoldings: IStockItemHoldings): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(stockItemHoldings);
        return this.http
            .post<IStockItemHoldings>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(stockItemHoldings: IStockItemHoldings): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(stockItemHoldings);
        return this.http
            .put<IStockItemHoldings>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IStockItemHoldings>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IStockItemHoldings[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(stockItemHoldings: IStockItemHoldings): IStockItemHoldings {
        const copy: IStockItemHoldings = Object.assign({}, stockItemHoldings, {
            lastEditedWhen:
                stockItemHoldings.lastEditedWhen && stockItemHoldings.lastEditedWhen.isValid()
                    ? stockItemHoldings.lastEditedWhen.toJSON()
                    : undefined,
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
            res.body.forEach((stockItemHoldings: IStockItemHoldings) => {
                stockItemHoldings.lastEditedWhen = stockItemHoldings.lastEditedWhen ? moment(stockItemHoldings.lastEditedWhen) : undefined;
            });
        }
        return res;
    }
}

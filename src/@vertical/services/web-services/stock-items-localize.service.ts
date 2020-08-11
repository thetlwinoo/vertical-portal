import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IStockItemsLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IStockItemsLocalize>;
type EntityArrayResponseType = HttpResponse<IStockItemsLocalize[]>;

@Injectable({ providedIn: 'root' })
export class StockItemsLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/stock-items-localizes';

    constructor(protected http: HttpClient) { }

    create(stockItemsLocalize: IStockItemsLocalize): Observable<EntityResponseType> {
        return this.http.post<IStockItemsLocalize>(this.resourceUrl, stockItemsLocalize, { observe: 'response' });
    }

    update(stockItemsLocalize: IStockItemsLocalize): Observable<EntityResponseType> {
        return this.http.put<IStockItemsLocalize>(this.resourceUrl, stockItemsLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IStockItemsLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IStockItemsLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

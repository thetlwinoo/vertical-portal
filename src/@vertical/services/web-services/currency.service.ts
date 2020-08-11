import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ICurrency } from '@vertical/models';

type EntityResponseType = HttpResponse<ICurrency>;
type EntityArrayResponseType = HttpResponse<ICurrency[]>;

@Injectable({ providedIn: 'root' })
export class CurrencyService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/currencies';

    constructor(protected http: HttpClient) { }

    create(currency: ICurrency): Observable<EntityResponseType> {
        return this.http.post<ICurrency>(this.resourceUrl, currency, { observe: 'response' });
    }

    update(currency: ICurrency): Observable<EntityResponseType> {
        return this.http.put<ICurrency>(this.resourceUrl, currency, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICurrency>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICurrency[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

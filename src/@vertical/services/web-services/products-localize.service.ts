import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductsLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductsLocalize>;
type EntityArrayResponseType = HttpResponse<IProductsLocalize[]>;

@Injectable({ providedIn: 'root' })
export class ProductsLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/products-localizes';

    constructor(protected http: HttpClient) { }

    create(productsLocalize: IProductsLocalize): Observable<EntityResponseType> {
        return this.http.post<IProductsLocalize>(this.resourceUrl, productsLocalize, { observe: 'response' });
    }

    update(productsLocalize: IProductsLocalize): Observable<EntityResponseType> {
        return this.http.put<IProductsLocalize>(this.resourceUrl, productsLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductsLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductsLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductBrandLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductBrandLocalize>;
type EntityArrayResponseType = HttpResponse<IProductBrandLocalize[]>;

@Injectable({ providedIn: 'root' })
export class ProductBrandLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-brand-localizes';

    constructor(protected http: HttpClient) { }

    create(productBrandLocalize: IProductBrandLocalize): Observable<EntityResponseType> {
        return this.http.post<IProductBrandLocalize>(this.resourceUrl, productBrandLocalize, { observe: 'response' });
    }

    update(productBrandLocalize: IProductBrandLocalize): Observable<EntityResponseType> {
        return this.http.put<IProductBrandLocalize>(this.resourceUrl, productBrandLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductBrandLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductBrandLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

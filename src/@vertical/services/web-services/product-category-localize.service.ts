import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductCategoryLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductCategoryLocalize>;
type EntityArrayResponseType = HttpResponse<IProductCategoryLocalize[]>;

@Injectable({ providedIn: 'root' })
export class ProductCategoryLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-category-localizes';

    constructor(protected http: HttpClient) { }

    create(productCategoryLocalize: IProductCategoryLocalize): Observable<EntityResponseType> {
        return this.http.post<IProductCategoryLocalize>(this.resourceUrl, productCategoryLocalize, { observe: 'response' });
    }

    update(productCategoryLocalize: IProductCategoryLocalize): Observable<EntityResponseType> {
        return this.http.put<IProductCategoryLocalize>(this.resourceUrl, productCategoryLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductCategoryLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductCategoryLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

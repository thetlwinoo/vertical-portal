import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductAttributeSet } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductAttributeSet>;
type EntityArrayResponseType = HttpResponse<IProductAttributeSet[]>;

@Injectable({ providedIn: 'root' })
export class ProductAttributeSetService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-attribute-sets';

    constructor(protected http: HttpClient) { }

    create(productAttributeSet: IProductAttributeSet): Observable<EntityResponseType> {
        return this.http.post<IProductAttributeSet>(this.resourceUrl, productAttributeSet, { observe: 'response' });
    }

    update(productAttributeSet: IProductAttributeSet): Observable<EntityResponseType> {
        return this.http.put<IProductAttributeSet>(this.resourceUrl, productAttributeSet, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductAttributeSet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductAttributeSet[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductCategory } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductCategory>;
type EntityArrayResponseType = HttpResponse<IProductCategory[]>;

@Injectable({ providedIn: 'root' })
export class ProductCategoryService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-categories';
    public extendUrl = SERVER_API_URL + 'services/vscommerce/api/product-categories-extend';

    constructor(protected http: HttpClient) { }

    create(productCategory: IProductCategory): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productCategory);
        return this.http
            .post<IProductCategory>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(productCategory: IProductCategory): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productCategory);
        return this.http
            .put<IProductCategory>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IProductCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProductCategory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    fetchCategoriesTree(): Observable<EntityArrayResponseType> {
        return this.http.get<IProductCategory[]>(this.extendUrl, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(productCategory: IProductCategory): IProductCategory {
        const copy: IProductCategory = Object.assign({}, productCategory, {
            validFrom: productCategory.validFrom && productCategory.validFrom.isValid() ? productCategory.validFrom.toJSON() : undefined,
            validTo: productCategory.validTo && productCategory.validTo.isValid() ? productCategory.validTo.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
            res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((productCategory: IProductCategory) => {
                productCategory.validFrom = productCategory.validFrom ? moment(productCategory.validFrom) : undefined;
                productCategory.validTo = productCategory.validTo ? moment(productCategory.validTo) : undefined;
            });
        }
        return res;
    }
}

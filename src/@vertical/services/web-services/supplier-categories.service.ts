import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ISupplierCategories } from '@vertical/models';

type EntityResponseType = HttpResponse<ISupplierCategories>;
type EntityArrayResponseType = HttpResponse<ISupplierCategories[]>;

@Injectable({ providedIn: 'root' })
export class SupplierCategoriesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/supplier-categories';

    constructor(protected http: HttpClient) { }

    create(supplierCategories: ISupplierCategories): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(supplierCategories);
        return this.http
            .post<ISupplierCategories>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(supplierCategories: ISupplierCategories): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(supplierCategories);
        return this.http
            .put<ISupplierCategories>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ISupplierCategories>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ISupplierCategories[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(supplierCategories: ISupplierCategories): ISupplierCategories {
        const copy: ISupplierCategories = Object.assign({}, supplierCategories, {
            validFrom: supplierCategories.validFrom && supplierCategories.validFrom.isValid() ? supplierCategories.validFrom.toJSON() : undefined,
            validTo: supplierCategories.validTo && supplierCategories.validTo.isValid() ? supplierCategories.validTo.toJSON() : undefined,
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
            res.body.forEach((supplierCategories: ISupplierCategories) => {
                supplierCategories.validFrom = supplierCategories.validFrom ? moment(supplierCategories.validFrom) : undefined;
                supplierCategories.validTo = supplierCategories.validTo ? moment(supplierCategories.validTo) : undefined;
            });
        }
        return res;
    }
}

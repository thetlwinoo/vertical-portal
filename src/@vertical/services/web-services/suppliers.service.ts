import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ISuppliers } from '@vertical/models';

type EntityResponseType = HttpResponse<ISuppliers>;
type EntityArrayResponseType = HttpResponse<ISuppliers[]>;

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/suppliers';
  public extendUrl = SERVER_API_URL + 'services/vscommerce/api/suppliers-extend';

  constructor(protected http: HttpClient) { }

  create(suppliers: ISuppliers): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(suppliers);
    return this.http
      .post<ISuppliers>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(suppliers: ISuppliers): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(suppliers);
    return this.http
      .put<ISuppliers>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISuppliers>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISuppliers[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSupplierByPrincipal(): Observable<EntityResponseType> {
    return this.http.get<ISuppliers>(this.extendUrl + '/principal', { observe: 'response' });
  }

  protected convertDateFromClient(suppliers: ISuppliers): ISuppliers {
    const copy: ISuppliers = Object.assign({}, suppliers, {
      validFrom: suppliers.validFrom && suppliers.validFrom.isValid() ? suppliers.validFrom.toJSON() : undefined,
      validTo: suppliers.validTo && suppliers.validTo.isValid() ? suppliers.validTo.toJSON() : undefined,
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
      res.body.forEach((suppliers: ISuppliers) => {
        suppliers.validFrom = suppliers.validFrom ? moment(suppliers.validFrom) : undefined;
        suppliers.validTo = suppliers.validTo ? moment(suppliers.validTo) : undefined;
      });
    }
    return res;
  }
}

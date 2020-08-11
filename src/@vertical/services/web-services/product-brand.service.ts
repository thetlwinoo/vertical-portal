import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductBrand } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductBrand>;
type EntityArrayResponseType = HttpResponse<IProductBrand[]>;

@Injectable({ providedIn: 'root' })
export class ProductBrandService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-brands';
  public extendUrl = SERVER_API_URL + 'services/vscommerce/api/product-brands-extend';

  constructor(protected http: HttpClient) { }

  create(productBrand: IProductBrand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productBrand);
    return this.http
      .post<IProductBrand>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productBrand: IProductBrand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productBrand);
    return this.http
      .put<IProductBrand>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductBrand>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductBrand[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  saveExtend(productBrand: IProductBrand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productBrand);
    return this.http
      .post<IProductBrand>(this.extendUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(productBrand: IProductBrand): IProductBrand {
    const copy: IProductBrand = Object.assign({}, productBrand, {
      validFrom: productBrand.validFrom && productBrand.validFrom.isValid() ? productBrand.validFrom.toJSON() : undefined,
      validTo: productBrand.validTo && productBrand.validTo.isValid() ? productBrand.validTo.toJSON() : undefined,
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
      res.body.forEach((productBrand: IProductBrand) => {
        productBrand.validFrom = productBrand.validFrom ? moment(productBrand.validFrom) : undefined;
        productBrand.validTo = productBrand.validTo ? moment(productBrand.validTo) : undefined;
      });
    }
    return res;
  }
}

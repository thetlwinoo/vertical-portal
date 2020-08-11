import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductDocuments } from '@vertical/models';

type EntityResponseType = HttpResponse<IProductDocuments>;
type EntityArrayResponseType = HttpResponse<IProductDocuments[]>;

@Injectable({ providedIn: 'root' })
export class ProductDocumentsService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-documents';
  public extendUrl = SERVER_API_URL + 'services/vscommerce/api/product-documents-extend';

  constructor(protected http: HttpClient) { }

  create(productDocuments: IProductDocuments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDocuments);
    return this.http
      .post<IProductDocuments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productDocuments: IProductDocuments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDocuments);
    return this.http
      .put<IProductDocuments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductDocuments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductDocuments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  importProductDocument(productDocument: IProductDocuments): Observable<IProductDocuments> {
    return this.http
      .post<IProductDocuments>(this.extendUrl + '/import', productDocument, { observe: 'response' })
      .pipe(
        filter((res: HttpResponse<IProductDocuments>) => res.ok),
        map((res: HttpResponse<IProductDocuments>) => res.body)
      );
  }

  protected convertDateFromClient(productDocuments: IProductDocuments): IProductDocuments {
    const copy: IProductDocuments = Object.assign({}, productDocuments, {
      lastEditedWhen:
        productDocuments.lastEditedWhen && productDocuments.lastEditedWhen.isValid() ? productDocuments.lastEditedWhen.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.lastEditedWhen = res.body.lastEditedWhen ? moment(res.body.lastEditedWhen) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productDocuments: IProductDocuments) => {
        productDocuments.lastEditedWhen = productDocuments.lastEditedWhen ? moment(productDocuments.lastEditedWhen) : undefined;
      });
    }
    return res;
  }
}

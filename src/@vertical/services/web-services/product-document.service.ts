import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IProductDocument } from '@vertical/models';
import { filter, map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IProductDocument>;
type EntityArrayResponseType = HttpResponse<IProductDocument[]>;

@Injectable({ providedIn: 'root' })
export class ProductDocumentService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/product-documents';
  public extendUrl = SERVER_API_URL + 'services/vscommerce/api/product-documents-extend';

  constructor(protected http: HttpClient) { }

  create(productDocument: IProductDocument): Observable<EntityResponseType> {
    return this.http.post<IProductDocument>(this.resourceUrl, productDocument, { observe: 'response' });
  }

  update(productDocument: IProductDocument): Observable<EntityResponseType> {
    return this.http.put<IProductDocument>(this.resourceUrl, productDocument, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductDocument[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  importProductDocument(productDocument: IProductDocument): Observable<IProductDocument> {
    return this.http
      .post<IProductDocument>(this.extendUrl + '/import', productDocument, { observe: 'response' })
      .pipe(
        filter((res: HttpResponse<IProductDocument>) => res.ok),
        map((res: HttpResponse<IProductDocument>) => res.body)
      );
  }
}

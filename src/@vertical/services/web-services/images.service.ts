import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IImages } from '@vertical/models';

type EntityResponseType = HttpResponse<IImages>;
type EntityArrayResponseType = HttpResponse<IImages[]>;

@Injectable({ providedIn: 'root' })
export class ImagesService {
  public resourceUrl = SERVER_API_URL + 'services/cloudblob/api/images';

  constructor(protected http: HttpClient) { }

  create(images: IImages): Observable<EntityResponseType> {
    return this.http.post<IImages>(this.resourceUrl, images, { observe: 'response' });
  }

  update(images: IImages): Observable<EntityResponseType> {
    return this.http.put<IImages>(this.resourceUrl, images, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IImages>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IImages[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

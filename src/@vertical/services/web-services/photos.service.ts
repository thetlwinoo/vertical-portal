import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IPhotos } from '@vertical/models';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IPhotos>;
type EntityArrayResponseType = HttpResponse<IPhotos[]>;

@Injectable({ providedIn: 'root' })
export class PhotosService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/photos';
  public extendUrl = SERVER_API_URL + 'services/vscommerce/api/photos-extend';

  constructor(protected http: HttpClient) { }

  create(photos: IPhotos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(photos);
    return this.http
      .post<IPhotos>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(photos: IPhotos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(photos);
    return this.http
      .put<IPhotos>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPhotos>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPhotos[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(photos: IPhotos): IPhotos {
    const copy: IPhotos = Object.assign({}, photos, {
      lastModifiedDate: photos.lastModifiedDate && photos.lastModifiedDate.isValid() ? photos.lastModifiedDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.lastModifiedDate = res.body.lastModifiedDate ? moment(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((photos: IPhotos) => {
        photos.lastModifiedDate = photos.lastModifiedDate ? moment(photos.lastModifiedDate) : undefined;
      });
    }
    return res;
  }

  deleteExtend(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.extendUrl}/photos/${id}`, { observe: 'response' });
  }

  createExtend(photos: IPhotos): Observable<EntityResponseType> {
    console.log('create photo', photos);
    return this.http.post<IPhotos>(this.extendUrl, photos, { observe: 'response' });
  }

  updateExtend(photos: IPhotos): Observable<EntityResponseType> {
    return this.http.put<IPhotos>(this.extendUrl, photos, { observe: 'response' });
  }

  setDefault(photos: IPhotos): Observable<EntityResponseType> {
    return this.http.put<IPhotos>(`${this.extendUrl}/default`, photos, { observe: 'response' });
  }

  deleteByBlodId(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.extendUrl}/blob/${id}`, { observe: 'response' });
  }
}

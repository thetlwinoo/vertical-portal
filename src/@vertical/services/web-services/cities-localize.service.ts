import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ICitiesLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<ICitiesLocalize>;
type EntityArrayResponseType = HttpResponse<ICitiesLocalize[]>;

@Injectable({ providedIn: 'root' })
export class CitiesLocalizeService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/cities-localizes';

  constructor(protected http: HttpClient) { }

  create(citiesLocalize: ICitiesLocalize): Observable<EntityResponseType> {
    return this.http.post<ICitiesLocalize>(this.resourceUrl, citiesLocalize, { observe: 'response' });
  }

  update(citiesLocalize: ICitiesLocalize): Observable<EntityResponseType> {
    return this.http.put<ICitiesLocalize>(this.resourceUrl, citiesLocalize, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICitiesLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICitiesLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

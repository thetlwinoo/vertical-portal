import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IStateProvincesLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IStateProvincesLocalize>;
type EntityArrayResponseType = HttpResponse<IStateProvincesLocalize[]>;

@Injectable({ providedIn: 'root' })
export class StateProvincesLocalizeService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/state-provinces-localizes';

  constructor(protected http: HttpClient) { }

  create(stateProvincesLocalize: IStateProvincesLocalize): Observable<EntityResponseType> {
    return this.http.post<IStateProvincesLocalize>(this.resourceUrl, stateProvincesLocalize, { observe: 'response' });
  }

  update(stateProvincesLocalize: IStateProvincesLocalize): Observable<EntityResponseType> {
    return this.http.put<IStateProvincesLocalize>(this.resourceUrl, stateProvincesLocalize, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStateProvincesLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStateProvincesLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

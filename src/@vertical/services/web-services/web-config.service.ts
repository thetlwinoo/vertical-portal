import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IWebConfig } from '@vertical/models';

type EntityResponseType = HttpResponse<IWebConfig>;
type EntityArrayResponseType = HttpResponse<IWebConfig[]>;

@Injectable({ providedIn: 'root' })
export class WebConfigService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/web-configs';

    constructor(protected http: HttpClient) { }

    create(webConfig: IWebConfig): Observable<EntityResponseType> {
        return this.http.post<IWebConfig>(this.resourceUrl, webConfig, { observe: 'response' });
    }

    update(webConfig: IWebConfig): Observable<EntityResponseType> {
        return this.http.put<IWebConfig>(this.resourceUrl, webConfig, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IWebConfig>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IWebConfig[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

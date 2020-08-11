import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IRegionsLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IRegionsLocalize>;
type EntityArrayResponseType = HttpResponse<IRegionsLocalize[]>;

@Injectable({ providedIn: 'root' })
export class RegionsLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/regions-localizes';

    constructor(protected http: HttpClient) { }

    create(regionsLocalize: IRegionsLocalize): Observable<EntityResponseType> {
        return this.http.post<IRegionsLocalize>(this.resourceUrl, regionsLocalize, { observe: 'response' });
    }

    update(regionsLocalize: IRegionsLocalize): Observable<EntityResponseType> {
        return this.http.put<IRegionsLocalize>(this.resourceUrl, regionsLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IRegionsLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IRegionsLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

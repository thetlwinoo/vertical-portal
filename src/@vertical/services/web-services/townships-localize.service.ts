import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ITownshipsLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<ITownshipsLocalize>;
type EntityArrayResponseType = HttpResponse<ITownshipsLocalize[]>;

@Injectable({ providedIn: 'root' })
export class TownshipsLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/townships-localizes';

    constructor(protected http: HttpClient) { }

    create(townshipsLocalize: ITownshipsLocalize): Observable<EntityResponseType> {
        return this.http.post<ITownshipsLocalize>(this.resourceUrl, townshipsLocalize, { observe: 'response' });
    }

    update(townshipsLocalize: ITownshipsLocalize): Observable<EntityResponseType> {
        return this.http.put<ITownshipsLocalize>(this.resourceUrl, townshipsLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITownshipsLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITownshipsLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

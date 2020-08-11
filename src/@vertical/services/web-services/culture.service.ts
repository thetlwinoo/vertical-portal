import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ICulture } from '@vertical/models';

type EntityResponseType = HttpResponse<ICulture>;
type EntityArrayResponseType = HttpResponse<ICulture[]>;

@Injectable({ providedIn: 'root' })
export class CultureService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/cultures';

    constructor(protected http: HttpClient) { }

    create(culture: ICulture): Observable<EntityResponseType> {
        return this.http.post<ICulture>(this.resourceUrl, culture, { observe: 'response' });
    }

    update(culture: ICulture): Observable<EntityResponseType> {
        return this.http.put<ICulture>(this.resourceUrl, culture, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICulture>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICulture[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

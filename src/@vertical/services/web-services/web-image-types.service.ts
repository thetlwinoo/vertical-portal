import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IWebImageTypes } from '@vertical/models';

type EntityResponseType = HttpResponse<IWebImageTypes>;
type EntityArrayResponseType = HttpResponse<IWebImageTypes[]>;

@Injectable({ providedIn: 'root' })
export class WebImageTypesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/web-image-types';

    constructor(protected http: HttpClient) { }

    create(webImageTypes: IWebImageTypes): Observable<EntityResponseType> {
        return this.http.post<IWebImageTypes>(this.resourceUrl, webImageTypes, { observe: 'response' });
    }

    update(webImageTypes: IWebImageTypes): Observable<EntityResponseType> {
        return this.http.put<IWebImageTypes>(this.resourceUrl, webImageTypes, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IWebImageTypes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IWebImageTypes[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

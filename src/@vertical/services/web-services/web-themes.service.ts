import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IWebThemes } from '@vertical/models';

type EntityResponseType = HttpResponse<IWebThemes>;
type EntityArrayResponseType = HttpResponse<IWebThemes[]>;

@Injectable({ providedIn: 'root' })
export class WebThemesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/web-themes';

    constructor(protected http: HttpClient) { }

    create(webThemes: IWebThemes): Observable<EntityResponseType> {
        return this.http.post<IWebThemes>(this.resourceUrl, webThemes, { observe: 'response' });
    }

    update(webThemes: IWebThemes): Observable<EntityResponseType> {
        return this.http.put<IWebThemes>(this.resourceUrl, webThemes, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IWebThemes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IWebThemes[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

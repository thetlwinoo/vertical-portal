import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IMaterialsLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<IMaterialsLocalize>;
type EntityArrayResponseType = HttpResponse<IMaterialsLocalize[]>;

@Injectable({ providedIn: 'root' })
export class MaterialsLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/materials-localizes';

    constructor(protected http: HttpClient) { }

    create(materialsLocalize: IMaterialsLocalize): Observable<EntityResponseType> {
        return this.http.post<IMaterialsLocalize>(this.resourceUrl, materialsLocalize, { observe: 'response' });
    }

    update(materialsLocalize: IMaterialsLocalize): Observable<EntityResponseType> {
        return this.http.put<IMaterialsLocalize>(this.resourceUrl, materialsLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMaterialsLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMaterialsLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

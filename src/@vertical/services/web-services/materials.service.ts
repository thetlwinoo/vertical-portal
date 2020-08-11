import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IMaterials } from '@vertical/models';

type EntityResponseType = HttpResponse<IMaterials>;
type EntityArrayResponseType = HttpResponse<IMaterials[]>;

@Injectable({ providedIn: 'root' })
export class MaterialsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/materials';

    constructor(protected http: HttpClient) { }

    create(materials: IMaterials): Observable<EntityResponseType> {
        return this.http.post<IMaterials>(this.resourceUrl, materials, { observe: 'response' });
    }

    update(materials: IMaterials): Observable<EntityResponseType> {
        return this.http.put<IMaterials>(this.resourceUrl, materials, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMaterials>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMaterials[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

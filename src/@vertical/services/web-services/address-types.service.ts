import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IAddressTypes } from '@vertical/models';

type EntityResponseType = HttpResponse<IAddressTypes>;
type EntityArrayResponseType = HttpResponse<IAddressTypes[]>;

@Injectable({ providedIn: 'root' })
export class AddressTypesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/address-types';

    constructor(protected http: HttpClient) { }

    create(addressTypes: IAddressTypes): Observable<EntityResponseType> {
        return this.http.post<IAddressTypes>(this.resourceUrl, addressTypes, { observe: 'response' });
    }

    update(addressTypes: IAddressTypes): Observable<EntityResponseType> {
        return this.http.put<IAddressTypes>(this.resourceUrl, addressTypes, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IAddressTypes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAddressTypes[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

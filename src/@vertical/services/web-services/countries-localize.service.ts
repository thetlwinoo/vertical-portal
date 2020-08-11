import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { ICountriesLocalize } from '@vertical/models';

type EntityResponseType = HttpResponse<ICountriesLocalize>;
type EntityArrayResponseType = HttpResponse<ICountriesLocalize[]>;

@Injectable({ providedIn: 'root' })
export class CountriesLocalizeService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/countries-localizes';

    constructor(protected http: HttpClient) { }

    create(countriesLocalize: ICountriesLocalize): Observable<EntityResponseType> {
        return this.http.post<ICountriesLocalize>(this.resourceUrl, countriesLocalize, { observe: 'response' });
    }

    update(countriesLocalize: ICountriesLocalize): Observable<EntityResponseType> {
        return this.http.put<ICountriesLocalize>(this.resourceUrl, countriesLocalize, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICountriesLocalize>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICountriesLocalize[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

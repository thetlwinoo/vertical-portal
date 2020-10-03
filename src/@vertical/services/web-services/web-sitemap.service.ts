import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IWebSitemap } from '@vertical/models';

type EntityResponseType = HttpResponse<IWebSitemap>;
type EntityArrayResponseType = HttpResponse<IWebSitemap[]>;

@Injectable({ providedIn: 'root' })
export class WebSitemapService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/web-sitemaps';

    constructor(protected http: HttpClient) { }

    create(webSitemap: IWebSitemap): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(webSitemap);
        return this.http
            .post<IWebSitemap>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(webSitemap: IWebSitemap): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(webSitemap);
        return this.http
            .put<IWebSitemap>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IWebSitemap>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IWebSitemap[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(webSitemap: IWebSitemap): IWebSitemap {
        const copy: IWebSitemap = Object.assign({}, webSitemap, {
            validFrom: webSitemap.validFrom && webSitemap.validFrom.isValid() ? webSitemap.validFrom.toJSON() : undefined,
            validTo: webSitemap.validTo && webSitemap.validTo.isValid() ? webSitemap.validTo.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
            res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((webSitemap: IWebSitemap) => {
                webSitemap.validFrom = webSitemap.validFrom ? moment(webSitemap.validFrom) : undefined;
                webSitemap.validTo = webSitemap.validTo ? moment(webSitemap.validTo) : undefined;
            });
        }
        return res;
    }
}

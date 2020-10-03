import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IWebImages } from '@vertical/models';

type EntityResponseType = HttpResponse<IWebImages>;
type EntityArrayResponseType = HttpResponse<IWebImages[]>;

@Injectable({ providedIn: 'root' })
export class WebImagesService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/web-images';

    constructor(protected http: HttpClient) { }

    create(webImages: IWebImages): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(webImages);
        return this.http
            .post<IWebImages>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(webImages: IWebImages): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(webImages);
        return this.http
            .put<IWebImages>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IWebImages>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IWebImages[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(webImages: IWebImages): IWebImages {
        const copy: IWebImages = Object.assign({}, webImages, {
            promoStartDate: webImages.promoStartDate && webImages.promoStartDate.isValid() ? webImages.promoStartDate.toJSON() : undefined,
            promoEndDate: webImages.promoEndDate && webImages.promoEndDate.isValid() ? webImages.promoEndDate.toJSON() : undefined,
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.promoStartDate = res.body.promoStartDate ? moment(res.body.promoStartDate) : undefined;
            res.body.promoEndDate = res.body.promoEndDate ? moment(res.body.promoEndDate) : undefined;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((webImages: IWebImages) => {
                webImages.promoStartDate = webImages.promoStartDate ? moment(webImages.promoStartDate) : undefined;
                webImages.promoEndDate = webImages.promoEndDate ? moment(webImages.promoEndDate) : undefined;
            });
        }
        return res;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from '@vertical/constants';
import { createRequestOption } from '@vertical/utils';
import { IDeliveryMethods } from '@vertical/models';

type EntityResponseType = HttpResponse<IDeliveryMethods>;
type EntityArrayResponseType = HttpResponse<IDeliveryMethods[]>;

@Injectable({ providedIn: 'root' })
export class DeliveryMethodsService {
    public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/delivery-methods';

    constructor(protected http: HttpClient) { }

    create(deliveryMethods: IDeliveryMethods): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(deliveryMethods);
        return this.http
            .post<IDeliveryMethods>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(deliveryMethods: IDeliveryMethods): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(deliveryMethods);
        return this.http
            .put<IDeliveryMethods>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IDeliveryMethods>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IDeliveryMethods[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<{}>> {
        return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(deliveryMethods: IDeliveryMethods): IDeliveryMethods {
        const copy: IDeliveryMethods = Object.assign({}, deliveryMethods, {
            validFrom: deliveryMethods.validFrom && deliveryMethods.validFrom.isValid() ? deliveryMethods.validFrom.toJSON() : undefined,
            validTo: deliveryMethods.validTo && deliveryMethods.validTo.isValid() ? deliveryMethods.validTo.toJSON() : undefined,
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
            res.body.forEach((deliveryMethods: IDeliveryMethods) => {
                deliveryMethods.validFrom = deliveryMethods.validFrom ? moment(deliveryMethods.validFrom) : undefined;
                deliveryMethods.validTo = deliveryMethods.validTo ? moment(deliveryMethods.validTo) : undefined;
            });
        }
        return res;
    }
}

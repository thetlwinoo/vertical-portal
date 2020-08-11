import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT, SERVER_API_URL } from '@vertical/constants';
import { map } from 'rxjs/operators';

import { createRequestOption } from '@vertical/utils';
import { IProducts, Products, IStockItems, IPhotos, IProductTags } from '@vertical/models';
import { StockItemsService } from '@vertical/services/web-services/stock-items.service';
import { PhotosService } from '@vertical/services/web-services/photos.service';
import { filter } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IProducts>;
type EntityArrayResponseType = HttpResponse<IProducts[]>;

@Injectable({ providedIn: 'root' })
export class ProductsService {
  public resourceUrl = SERVER_API_URL + 'services/vscommerce/api/products';
  public extendUrl = SERVER_API_URL + 'services/vscommerce/api/products-extend';
  public uploadUrl = SERVER_API_URL + 'services/vscommerce/api/excelupload';
  public importUrl = SERVER_API_URL + 'services/vscommerce/api/importtosystem';

  constructor(protected http: HttpClient, private stockItemsService: StockItemsService, private photosService: PhotosService) { }

  create(products: IProducts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(products);
    return this.http
      .post<IProducts>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(products: IProducts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(products);
    return this.http
      .put<IProducts>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProducts>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProducts[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProducts[]>(this.extendUrl + '/search', { params: options, observe: 'response' });
  }

  searchAll(keyword: string): Observable<EntityArrayResponseType> {
    let params = new HttpParams();
    params = params.append('keyword', keyword);
    return this.http.get<IProducts[]>(this.extendUrl + '/searchall', { params, observe: 'response' });
  }

  getOne(id: number): Observable<EntityResponseType> {
    return this.http.get<IProducts>(`${this.extendUrl}/${id}`, { observe: 'response' });
  }

  createProducts(products: Products): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(products);
    return this.http
      .post<IProducts>(this.extendUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  updateProducts(products: Products): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(products);
    return this.http
      .put<IProducts>(this.extendUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  upload(file: any): Observable<any> {
    console.log('upload path', file);
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<any>(this.uploadUrl, formData, { observe: 'response' })
      .pipe(
        filter((res: HttpResponse<any>) => res.ok),
        map((res: HttpResponse<any>) => res.body)
      );
  }

  importProduct(products: IProductTags): Observable<IProducts> {
    const copy = this.convertDateFromClient(products);

    return this.http
      .post<IProducts>(this.extendUrl + '/import', copy, { observe: 'response' })
      .pipe(
        map((res: EntityResponseType) => this.convertDateFromServer(res)),
        filter((res: HttpResponse<Products>) => res.ok),
        map((res: HttpResponse<Products>) => res.body)
      );
  }

  updateProductDetails(productId: number): Observable<HttpResponse<{}>> {
    return this.http.post<IProducts>(`${this.extendUrl}${'/details-update/'}${productId}`, null, { observe: 'response' });
  }

  updateStockItemActive(stockItemId, isActive): Observable<EntityResponseType> {
    let params = new HttpParams();
    params = params.append('stockItemId', stockItemId);
    params = params.append('isActive', isActive);
    return this.http
      .put<Products>(this.extendUrl + '/products/stock-item', params, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(products: IProducts): IProducts {
    const copy: IProducts = Object.assign({}, products, {
      releaseDate: products.releaseDate && products.releaseDate.isValid() ? products.releaseDate.toJSON() : undefined,
      availableDate: products.availableDate && products.availableDate.isValid() ? products.availableDate.toJSON() : undefined,
      lastEditedWhen: products.lastEditedWhen && products.lastEditedWhen.isValid() ? products.lastEditedWhen.toJSON() : undefined,
      validFrom: products.validFrom && products.validFrom.isValid() ? products.validFrom.toJSON() : undefined,
      validTo: products.validTo && products.validTo.isValid() ? products.validTo.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.releaseDate = res.body.releaseDate ? moment(res.body.releaseDate) : undefined;
      res.body.availableDate = res.body.availableDate ? moment(res.body.availableDate) : undefined;
      res.body.lastEditedWhen = res.body.lastEditedWhen ? moment(res.body.lastEditedWhen) : undefined;
      res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
      res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((products: IProducts) => {
        products.releaseDate = products.releaseDate ? moment(products.releaseDate) : undefined;
        products.availableDate = products.availableDate ? moment(products.availableDate) : undefined;
        products.lastEditedWhen = products.lastEditedWhen ? moment(products.lastEditedWhen) : undefined;
        products.validFrom = products.validFrom ? moment(products.validFrom) : undefined;
        products.validTo = products.validTo ? moment(products.validTo) : undefined;
      });
    }
    return res;
  }
}

import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, filter, mergeMap, switchMap } from 'rxjs/operators';
import { ISuppliers } from '@vertical/models';
import { SupplierActions } from '../actions';
import { SuppliersService } from '@vertical/services';

@Injectable()
export class SupplierEffects {
  fetchSuppliers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupplierActions.fetchSuppliers),
      switchMap(({ query }) =>
        this.supplierService.query(query).pipe(
          filter((res: HttpResponse<ISuppliers[]>) => res.ok),
          map((res: HttpResponse<ISuppliers[]>) => SupplierActions.fetchSuppliersSuccess({ suppliers: res.body })),
          catchError(err => of(SupplierActions.supplierError({ errorMsg: err.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private supplierService: SuppliersService) { }
}

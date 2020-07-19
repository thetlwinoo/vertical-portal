import { createAction, props } from '@ngrx/store';

import { ISuppliers } from '@vertical/models';

export const fetchSuppliers = createAction('[Supplier/API] Fetch Suppliers', props<{ query: any }>());

export const fetchSuppliersSuccess = createAction('[Supplier/API] Fetch Suppliers Success', props<{ suppliers: ISuppliers[] }>());

export const selectSupplier = createAction('[Supplier/API] Select Supplier', props<{ supplier: ISuppliers }>());

export const supplierError = createAction('[Supplier/API] Supplier Error', props<{ errorMsg: string }>());

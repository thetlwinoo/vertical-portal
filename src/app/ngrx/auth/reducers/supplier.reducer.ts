import { createReducer, on } from '@ngrx/store';

import { SupplierActions } from 'app/ngrx/auth/actions';
import { ISuppliers } from '@vertical/models';

export const supplierFeatureKey = 'supplier';

export interface State {
  loaded: boolean;
  loading: boolean;
  suppliers: ISuppliers[];
  selected: ISuppliers;
  error: string;
}

const initialState: State = {
  loaded: false,
  loading: false,
  suppliers: [],
  selected: null,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(SupplierActions.fetchSuppliers, state => ({
    ...state,
    loading: true,
  })),
  on(SupplierActions.fetchSuppliersSuccess, (state, { suppliers }) => ({
    loaded: true,
    loading: false,
    suppliers,
    selected: suppliers[0],
    error: '',
  })),
  on(SupplierActions.selectSupplier, (state, { supplier }) => ({
    ...state,
    selected: supplier,
    error: '',
  })),
  on(SupplierActions.supplierError, (state, { errorMsg }) => ({
    ...state,
    loading: false,
    error: errorMsg,
  }))
);

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getSuppliers = (state: State) => state.suppliers;

export const getSelected = (state: State) => state.selected;

export const getError = (state: State) => state.error;

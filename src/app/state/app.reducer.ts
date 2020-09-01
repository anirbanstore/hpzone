import { createSelector, createFeatureSelector, createReducer, createAction, on } from '@ngrx/store';
import * as AppActions from './app.action';

import { Requisition } from './../shared/model/requisition.interface';

/** Define state structure and default state */
export interface AppState {
  requisitions: Requisition[];
  currentRequisition: Requisition | null;
  currentAction: string;
  error: string;
  authenticated: boolean;
  currentUser: string;
  authToken: string;
  navbarCollapsed: boolean;
  showLoading: boolean;
}

const initialState: AppState = {
  requisitions: null,
  currentRequisition: null,
  currentAction: null,
  error: '',
  authenticated: false,
  currentUser: null,
  authToken: null,
  navbarCollapsed: true,
  showLoading: false
};

/** Define selectors */
const getAppState = createFeatureSelector<AppState>('hpz');

export const getRequisitions = createSelector(getAppState, state => state.requisitions);
export const getCurrentRequisition = createSelector(getAppState, state => state.currentRequisition);
export const getCurrentAction = createSelector(getAppState, state => state.currentAction);
export const getError = createSelector(getAppState, state => state.error);
export const isAuthenticated = createSelector(getAppState, state => state.authenticated);
export const getCurrentUser = createSelector(getAppState, state => state.currentUser);
export const getAuthToken = createSelector(getAppState, state => state.authToken);
export const isNavbarCollapsed = createSelector(getAppState, state => state.navbarCollapsed);
export const isLoading = createSelector(getAppState, state => state.showLoading);

const appreducer = createReducer<AppState>(
  initialState,
  on(AppActions.signinAction, AppActions.saveAction, AppActions.searchAction, (state): AppState => {
    return {
      ...state,
      error: '',
      showLoading: true
    };
  }),
  on(AppActions.signinSuccessAction, (state, action): AppState => {
    return {
      ...state,
      authenticated: true,
      currentUser: action.currentUser,
      authToken: action.authToken,
      showLoading: false
    };
  }),
  on(AppActions.signinFailureAction, (state, action): AppState => {
    return {
      ...state,
      authenticated: false,
      currentUser: null,
      authToken: null,
      navbarCollapsed: true,
      error: action.error,
      showLoading: false
    };
  }),
  on(AppActions.signoutAction, (state): AppState => {
    return {
      ...state,
      showLoading: true
    };
  }),
  on(AppActions.signoutSuccessAction, AppActions.signoutFailureAction, (state): AppState => {
    return {
      ...state,
      authenticated: false,
      currentUser: null,
      authToken: null,
      navbarCollapsed: true,
      error: '',
      showLoading: false,
      currentRequisition: null,
      currentAction: null
    };
  }),
  on(AppActions.toggleNavbar, (state): AppState => {
    return {
      ...state,
      navbarCollapsed: !state.navbarCollapsed
    };
  }),
  on(AppActions.setViewModeAction, (state, action): AppState => {
    return {
      ...state,
      currentAction: action.mode,
      currentRequisition: action.currentRequisition
    };
  }),
  on(AppActions.saveSuccessAction, (state): AppState => {
    return {
      ...state,
      error: '',
      showLoading: false,
      currentRequisition: null,
      currentAction: null,
      requisitions: null
    };
  }),
  on(AppActions.saveFailureAction, AppActions.searchFailureAction, (state, action): AppState => {
    return {
      ...state,
      showLoading: false,
      error: action.error,
      requisitions: null
    };
  }),
  on(AppActions.searchSuccessAction, (state, action): AppState => {
    return {
      ...state,
      error: '',
      showLoading: false,
      currentRequisition: null,
      currentAction: null,
      requisitions: action.results
    };
  }),
  on(AppActions.clearSearchAction, (state): AppState => {
    return {
      ...state,
      showLoading: false,
      error: '',
      requisitions: null
    };
  })
);

export function reducer(state: AppState, action: any) {
  return appreducer(state, action);
}

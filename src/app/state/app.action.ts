import { createAction, props } from '@ngrx/store';

import { AuthState } from './../shared/model/auth.interface';
import { Requisition } from './../shared/model/requisition.interface';

export const signinAction = createAction(
  '[User] Signin',
  props<{ Username: string, Password: string }>()
);

export const signinSuccessAction = createAction(
  '[User] Signin Success',
  props<{ state: AuthState }>()
);

export const signinFailureAction = createAction(
  '[User] Signin Failure',
  props<{ error: string }>()
);

export const signoutAction = createAction('[User] Signout');

export const signoutSuccessAction = createAction('[User] Signout Success');

export const signoutFailureAction = createAction('[User] Signout Failure');

export const toggleNavbar = createAction('[HPZ UI] Toggle Navbar');

export const setViewModeAction = createAction(
  '[HPZ] Set View Mode',
  props<{ mode: string, currentRequisition: Requisition | null }>()
);

export const saveAction = createAction(
  '[HPZ] Save',
  props<{ reqNumber: number, payload: any, action: string }>()
);

export const saveSuccessAction = createAction(
  '[HPZ] Save Success'
);

export const saveFailureAction = createAction(
  '[HPZ] Save Failure',
  props<{ error: string }>()
);

export const searchAction = createAction(
  '[HPZ] Search',
  props<{ payload: string }>()
);

export const searchSuccessAction = createAction(
  '[HPZ] Search Success',
  props<{ results: Requisition[] }>()
);

export const searchFailureAction = createAction(
  '[HPZ] Search Failure',
  props<{ error: string }>()
);

export const clearSearchAction = createAction('[HPZ] Clear Search');

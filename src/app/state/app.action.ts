import { createAction, props } from '@ngrx/store';

export const signinAction = createAction(
  '[User] Signin',
  props<{ Username: string, Password: string }>()
);

export const signinSuccessAction = createAction(
  '[User] Signin Success',
  props<{ currentUser: string, authToken: string }>()
);

export const signinFailureAction = createAction(
  '[User] Signin Failure',
  props<{ error: string }>()
);

export const signoutAction = createAction('[User] Signout');

export const signoutSuccessAction = createAction('[User] Signout Success');

export const signoutFailureAction = createAction('[User] Signout Failure');

export const toggleNavbar = createAction('[HPZ UI] Toggle Navbar');

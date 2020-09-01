import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AppActions from '../state/app.action';
import { AuthState } from './../shared/model/auth.interface';
import { AuthService } from './../auth/auth.service';
import { RequisitionService } from '../requisitions/requisition.service';

@Injectable()
export class AppEffects {

  constructor(private action$: Actions, private auth: AuthService, private requisitionService: RequisitionService, private router: Router) {}

  signinEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.signinAction),
      mergeMap(action => this.auth.signin({ Username: action.Username, Password: action.Password}).pipe(
        map((state: AuthState) => {
          this.router.navigate(['requisition']);
          return AppActions.signinSuccessAction({ currentUser: action.Username, authToken: state.token });
        }),
        catchError(error => of(AppActions.signinFailureAction({ error: error.error.error })))
        )
      )
    );
  });

  signoutEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.signoutAction),
      mergeMap(() => this.auth.signout().pipe(
        map(() => {
          this.router.navigate(['/']);
          return AppActions.signoutSuccessAction();
        }),
        catchError(() => {
          this.router.navigate(['/']);
          return of(AppActions.signoutFailureAction());
        })
      ))
    );
  });

  saveAction$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.saveAction),
      mergeMap(action => this.requisitionService.createOrUpdateRequisition(action.reqNumber, action.payload, action.action).pipe(
        map(() => {
          this.router.navigate(['requisition']);
          return AppActions.saveSuccessAction();
        }),
        catchError(error => of(AppActions.saveFailureAction({ error: error.error.error })))
      ))
    );
  });
}

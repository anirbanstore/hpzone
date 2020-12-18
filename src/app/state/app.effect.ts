import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, switchMap, withLatestFrom, exhaustMap, timeout } from 'rxjs/operators';
import { of, TimeoutError } from 'rxjs';

import * as AppActions from '../state/app.action';
import { AuthState } from './../shared/model/auth.interface';
import { AuthService } from './../auth/auth.service';
import { RequisitionService } from '../requisitions/requisition.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AppEffects {

  private timeout = 10000;
  private timeoutMessage = 'HPZone server is unresponsive';

  constructor(private action$: Actions, private auth: AuthService, private requisitionService: RequisitionService, private router: Router) {}

  signinEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.signinAction),
      exhaustMap(action => this.auth.signin({ Username: action.Username, Password: action.Password}).pipe(
        timeout(this.timeout),
        map((state: AuthState) => {
          this.router.navigate(['requisition']);
          return AppActions.signinSuccessAction({ currentUser: action.Username, authToken: state.token });
        }),
        catchError(error => of(AppActions.signinFailureAction({ error: this.getErrorMessage(error) })))
        )
      )
    );
  });

  signoutEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.signoutAction),
      mergeMap(() => this.auth.signout().pipe(
        timeout(this.timeout),
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
        timeout(this.timeout),
        map(() => {
          this.router.navigate(['requisition']);
          return AppActions.saveSuccessAction();
        }),
        catchError(error => of(AppActions.saveFailureAction({ error: this.getErrorMessage(error) })))
      ))
    );
  });

  searchAction$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AppActions.searchAction),
      switchMap(action => this.requisitionService.search(action.payload).pipe(
        timeout(this.timeout),
        withLatestFrom(this.requisitionService.requisitionStatus$, this.requisitionService.cylinderStatus$),
        map(([requisitions, reqstatus, cylstatus]) => {
          const results = requisitions.map(requisition => this.requisitionService.requisitionMap(requisition, reqstatus, cylstatus));
          return AppActions.searchSuccessAction({ results });
        }),
        catchError(error => of(AppActions.searchFailureAction({ error: this.getErrorMessage(error) })))
      ))
    );
  });

  private getErrorMessage(error: any): string {
    if (error instanceof TimeoutError || error instanceof HttpErrorResponse) {
      return this.timeoutMessage;
    }
    return (error.error.error as string);
  }
}

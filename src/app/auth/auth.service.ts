import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, EMPTY, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { AuthState } from './../shared/model/auth.interface';

import { RestService } from '../shared/service/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private restconfig: RestService, private http: HttpClient) {}

  private authState: AuthState;

  private authErrorMessageSubject = new Subject<string>();
  public authErrorMessage$ = this.authErrorMessageSubject.asObservable();

  private authStateSubject = new Subject<AuthState>();
  public authState$ = this.authStateSubject.asObservable().pipe(
    startWith({ auth: false }),
    map(state => {
      this.authState = state;
      return state;
    })
  );

  private navbarCollapsedSubject = new BehaviorSubject<boolean>(true);
  public navbarCollapsed$ = this.navbarCollapsedSubject.asObservable();

  public isAuthenticated(): boolean {
    return this.authState.auth;
  }

  public getToken(): string {
    return this.authState.token;
  }

  public setErrorMessage(message: string): void {
    this.authErrorMessageSubject.next(message);
  }

  public setNavbarCollapsed(collapse: boolean): void {
    this.navbarCollapsedSubject.next(collapse);
  }

  public signin(payload: { Username: string, Password: string }): Observable<AuthState> {
    this.navbarCollapsedSubject.next(true);
    return this.http.post<AuthState>(this.restconfig.signin(), payload).pipe(
      catchError(err => {
        this.authErrorMessageSubject.next(err.error.error);
        return EMPTY;
      }),
      map((data: AuthState) => {
        this.authStateSubject.next(data);
        this.authState = data;
        return data;
      })
    );
  }

  public signout(): Observable<AuthState> {
    this.navbarCollapsedSubject.next(true);
    return this.http.post<AuthState>(this.restconfig.signout(), null).pipe(
      catchError(err => {
        this.authErrorMessageSubject.next(err.error.error);
        return throwError('Failed to sign out');
      }),
      map((data: AuthState) => {
        this.authStateSubject.next(data);
        return data;
      })
    );
  }
}

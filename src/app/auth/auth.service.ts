import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthState } from './../shared/model/auth.interface';

import { RestService } from '../shared/service/rest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private restconfig: RestService, private http: HttpClient) {}

  public signin(payload: { Username: string, Password: string }): Observable<AuthState> {
    return this.http.post<AuthState>(this.restconfig.signin(), payload);
  }

  public signout(): Observable<AuthState> {
    return this.http.post<AuthState>(this.restconfig.signout(), null);
  }
}

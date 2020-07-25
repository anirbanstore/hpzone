import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let clonedRequest: HttpRequest<any>;

    const authenticated = this.auth.isAuthenticated();
    if (authenticated) {
      const token = this.auth.getToken();
      clonedRequest = request.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token
        })
      });
    } else {
      clonedRequest = request.clone();
    }
    return next.handle(clonedRequest);
  }
}

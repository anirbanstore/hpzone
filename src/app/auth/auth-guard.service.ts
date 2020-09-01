import { isAuthenticated } from './../state/app.reducer';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/state/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.store.select(isAuthenticated).pipe(
        map(auth => {
          if (!auth) {
            this.router.navigate(['/']);
          }
          return auth;
        })
      );
  }
}

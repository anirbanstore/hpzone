import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AppState,
  isAuthenticated,
  getCurrentUser,
  isNavbarCollapsed,
  getProvider
} from './../state/app.reducer';
import * as AppActions from '../state/app.action';
import { AuthState } from './../shared/model/auth.interface';

@Component({
  selector: 'hpz-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  hpzoneHeader$: Observable<string>;
  authState$: Observable<AuthState>;
  authenticated$: Observable<boolean>;
  currentUser$: Observable<string>;
  provider$: Observable<string | null>;
  navbarCollapsed$: Observable<boolean>;

  collapse: boolean;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.authenticated$ = this.store.select(isAuthenticated);
    this.currentUser$ = this.store.select(getCurrentUser);
    this.provider$ = this.store.select(getProvider);
    this.navbarCollapsed$ = this.store.select(isNavbarCollapsed);
    this.collapse = true;
    this.hpzoneHeader$ = this.provider$.pipe(
      map((provider: string) => `${!!provider ? provider : 'Gas'} Zone`)
    );
  }

  public signout() {
    this.store.dispatch(AppActions.signoutAction());
  }

  public toggleNavbar(): void {
    this.store.dispatch(AppActions.toggleNavbar());
  }
}

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState, isAuthenticated, getCurrentUser, isNavbarCollapsed } from './../state/app.reducer';
import * as AppActions from '../state/app.action';
import { AuthState } from './../shared/model/auth.interface';

@Component({
  selector: 'hpz-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  hpzoneHeader = 'HP Zone';
  authState$: Observable<AuthState>;
  authenticated$: Observable<boolean>;
  currentUser$: Observable<string>;
  navbarCollapsed$: Observable<boolean>;

  collapse: boolean;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.authenticated$ = this.store.select(isAuthenticated);
    this.currentUser$ = this.store.select(getCurrentUser);
    this.navbarCollapsed$ = this.store.select(isNavbarCollapsed);
    this.collapse = true;
  }

  public signout() {
    this.store.dispatch(AppActions.signoutAction());
  }

  public toggleNavbar(): void {
    this.store.dispatch(AppActions.toggleNavbar());
  }

}

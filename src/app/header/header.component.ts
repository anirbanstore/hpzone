import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from './../auth/auth.service';

import { AuthState } from './../shared/model/auth.interface';

@Component({
  selector: 'hpz-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {

  hpzoneHeader = 'HP Zone';
  authState$: Observable<AuthState>;
  navbarCollapsed$: Observable<boolean>;

  collapse: boolean;

  private authSubscription: Subscription;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.authState$ = this.auth.authState$;
    this.navbarCollapsed$ = this.auth.navbarCollapsed$;
    this.collapse = true;
  }

  ngOnDestroy() {
    if (!!this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  public signout() {
    this.authSubscription = this.auth.signout().subscribe({
      next: () => this.router.navigate(['signin']),
      error: () => this.router.navigate(['signin'])
    });
  }

  public toggleNavbar(): void {
    this.collapse = !this.collapse;
    this.auth.setNavbarCollapsed(this.collapse);
  }

}

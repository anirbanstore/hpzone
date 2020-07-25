import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'hpz-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit, OnDestroy {

  public signinForm: FormGroup;
  public authErrorMessage$: Observable<string>;

  private authSubscription: Subscription;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.authErrorMessage$ = this.auth.authErrorMessage$;
    this.signinForm = new FormGroup({
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required)
    });
  }

  ngOnDestroy() {
    if (!!this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  public onSignin(): void {
    this.auth.setErrorMessage(null);
    const Username = this.signinForm.value.Username;
    const Password = this.signinForm.value.Password;

    if ((!Username) || (Username == null) || (!Password) || (Password == null)) {
      this.auth.setErrorMessage(`Username or password cannot be empty`);
      return;
    }

    this.authSubscription = this.auth.signin(this.signinForm.value).subscribe({
      next: () => this.router.navigate(['requisition'])
    });
  }

}

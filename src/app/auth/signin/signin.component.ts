import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, getError } from './../../state/app.reducer';
import * as AppActions from './../../state/app.action';

@Component({
  selector: 'hpz-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  authErrorMessage$: Observable<string>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.authErrorMessage$ = this.store.select(getError);
    this.signinForm = new FormGroup({
      Username: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required)
    });
  }

  onSignin(): void {
    const Username = this.signinForm.value.Username;
    const Password = this.signinForm.value.Password;

    if (!Username || Username == null || !Password || Password == null) {
      this.store.dispatch(
        AppActions.signinFailureAction({
          error: `Username or password cannot be empty`
        })
      );
      return;
    }

    this.store.dispatch(AppActions.signinAction({ Username, Password }));
  }
}

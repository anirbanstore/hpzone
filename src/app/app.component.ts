import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppState, isLoading } from './state/app.reducer';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'hpz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  public showLoading$: Observable<boolean>;
  private showLoadingSub: Subscription;

  constructor(private store: Store<AppState>, private spinner: NgxSpinnerService, update: SwUpdate) {
    update.available.subscribe({
      next: () => update.activateUpdate().then(() => document.location.reload())
    });
  }

  ngOnInit(): void {
    this.showLoading$ = this.store.select(isLoading);
    this.showLoadingSub = this.showLoading$.subscribe({
      next: (loading: boolean) => loading ? this.spinner.show() : this.spinner.hide()
    });
  }

  ngOnDestroy(): void {
    if (!!this.showLoadingSub) {
      this.showLoadingSub.unsubscribe();
    }
  }
}

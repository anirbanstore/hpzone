import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState, isLoading } from './state/app.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'hpz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public showLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.showLoading$ = this.store.select(isLoading);
  }
}

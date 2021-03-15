import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Requisition } from '../shared/model/requisition.interface';
import { AppState, getError, getRequisitions } from './../state/app.reducer';
import * as AppActions from './../state/app.action';

@Component({
  selector: 'hpz-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrls: ['./requisitions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisitionsComponent implements OnInit {
  constructor(private router: Router, private store: Store<AppState>) {}

  pageTitle = 'Requisitions';
  public requisition$: Observable<Requisition[]>;
  public reqErrorMessage$: Observable<string>;

  ngOnInit() {
    this.requisition$ = this.store.select(getRequisitions);
    this.reqErrorMessage$ = this.store.select(getError);
  }

  createRequisition(): void {
    this.store.dispatch(
      AppActions.setViewModeAction({ mode: 'new', currentRequisition: null })
    );
    this.router.navigate(['view']);
  }
}

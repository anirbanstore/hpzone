import { Router } from '@angular/router';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Requisition } from './../../shared/model/requisition.interface';
import { AppState } from './../../state/app.reducer';
import * as AppActions from './../../state/app.action';

@Component({
  selector: 'hpz-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent {
  @Input() requisition: Requisition;

  constructor(private router: Router, private store: Store<AppState>) {}

  editRequisition(requisition: Requisition): void {
    this.store.dispatch(
      AppActions.setViewModeAction({
        mode: 'edit',
        currentRequisition: requisition
      })
    );
    this.router.navigate(['view']);
  }
}

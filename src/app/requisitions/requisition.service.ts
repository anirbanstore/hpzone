import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
  getCurrentAction,
  getCurrentRequisition
} from './../state/app.reducer';
import { AppState } from '../state/app.reducer';

import { RestService } from './../shared/service/rest.service';

import { Requisition } from './../shared/model/requisition.interface';
import { Status } from '../shared/model/status.interface';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  constructor(
    private http: HttpClient,
    private restconfig: RestService,
    private store: Store<AppState>
  ) {}

  private status$: Observable<Status[]> = this.http
    .get<Status[]>(this.restconfig.getStatus())
    .pipe(shareReplay(1));
  private requisition$: Observable<Requisition[]> = this.http.get<
    Requisition[]
  >(this.restconfig.getSearchedRequisitions());
  private userAction$ = this.store.select(getCurrentAction);

  requisitionStatus$: Observable<Status[]> = this.status$.pipe(
    map((statuses: Status[]) =>
      statuses
        .filter(status => status.LookupCode === 'HP_REQ_STATUS')
        .sort(
          (status1, status2) =>
            status1.DisplaySequence - status2.DisplaySequence
        )
    ),
    shareReplay(1)
  );
  cylinderStatus$: Observable<Status[]> = this.status$.pipe(
    map((statuses: Status[]) =>
      statuses
        .filter(status => status.LookupCode === 'HP_CYL_STATUS')
        .sort(
          (status1, status2) =>
            status1.DisplaySequence - status2.DisplaySequence
        )
    ),
    shareReplay(1)
  );

  requisitionWithStatus$: Observable<Requisition[]> = combineLatest([
    this.requisition$,
    this.requisitionStatus$,
    this.cylinderStatus$
  ]).pipe(
    map(([requisitions, reqstatus, cylstatus]) =>
      requisitions.map((requisition: Requisition) =>
        this.requisitionMap(requisition, reqstatus, cylstatus)
      )
    )
  );

  currentRequisition$ = this.store.select(getCurrentRequisition);

  currentActionWithData$: Observable<{
    action: string;
    requisition: Requisition | null;
  }> = combineLatest([this.userAction$, this.currentRequisition$]).pipe(
    map(([action, requisition]) => {
      if (action === 'edit') {
        return {
          action,
          requisition
        };
      } else {
        return { action, requisition: null };
      }
    })
  );

  search(filter: string): Observable<Requisition[]> {
    return this.http.get<Requisition[]>(
      this.restconfig.getSearchedRequisitions(filter)
    );
  }

  createOrUpdateRequisition(
    reqNumber: number,
    payload: any,
    action: string
  ): Observable<Requisition> {
    if (action === 'edit') {
      return this.http.patch<Requisition>(
        this.restconfig.updateRequisition(reqNumber),
        payload
      );
    } else {
      return this.http.post<Requisition>(
        this.restconfig.createRequisition(),
        payload
      );
    }
  }

  getFormattedDate(dt: Date): string {
    if (!dt) {
      return '';
    }
    const dd = dt.getDate() > 9 ? dt.getDate() : `0${dt.getDate()}`;
    const mm =
      dt.getMonth() + 1 > 9 ? dt.getMonth() + 1 : `0${dt.getMonth() + 1}`;
    const yyyy = dt.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  requisitionMap(
    requisition: Requisition,
    reqstatus: Status[],
    cylstatus: Status[]
  ): Requisition {
    requisition.DisplayRequisitionStatus = reqstatus.find(
      status => status.LookupKey === requisition.RequisitionStatus
    ).LookupValue;
    requisition.DisplayCylinderStatus = !!requisition.CylinderStatus
      ? cylstatus.find(
          status => status.LookupKey === requisition.CylinderStatus
        ).LookupValue
      : '';
    return requisition;
  }
}

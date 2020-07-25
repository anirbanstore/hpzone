import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, BehaviorSubject, Subject, EMPTY } from 'rxjs';
import { shareReplay, map, catchError, tap, switchMap } from 'rxjs/operators';

import { RestService } from './../shared/service/rest.service';

import { Requisition } from './../shared/model/requisition.interface';
import { Status } from '../shared/model/status.interface';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {

  constructor(private http: HttpClient, private restconfig: RestService) {}

  private reqErrorMessageSubject = new Subject<string>();
  public reqErrorMessage$ = this.reqErrorMessageSubject.asObservable();

  private status$ = this.http.get<Status[]>(this.restconfig.getStatus()).pipe(shareReplay(1));
  public requisitionStatus$ = this.status$.pipe(
    map(statuses => statuses.
      filter(status => status.LookupCode === 'HP_REQ_STATUS')
      .sort((status1, status2) => status1.DisplaySequence - status2.DisplaySequence)),
    shareReplay(1)
  );
  public cylinderStatus$ = this.status$.pipe(
    map(statuses => statuses.
      filter(status => status.LookupCode === 'HP_CYL_STATUS')
      .sort((status1, status2) => status1.DisplaySequence - status2.DisplaySequence)),
    shareReplay(1)
  );

  private requisition$ = this.http.get<Requisition[]>(this.restconfig.getSearchedRequisitions());
  public requisitionWithStatus$ = combineLatest([
    this.requisition$,
    this.requisitionStatus$,
    this.cylinderStatus$
  ]).pipe(
    map(([requisitions, reqstatus, cylstatus]) => requisitions.map(requisition => this.requisitionMap(requisition, reqstatus, cylstatus)))
  );

  private searchActionSubject = new Subject<string>();
  private searchAction$ = this.searchActionSubject.asObservable();

  private requisitionWithSearch$ = this.searchAction$.pipe(
    switchMap(filter => this.http.get<Requisition[]>(this.restconfig.getSearchedRequisitions(filter)))
  );

  public requisitionWithStatusAndSearch$ = combineLatest([
    this.requisitionWithSearch$,
    this.requisitionStatus$,
    this.cylinderStatus$
  ]).pipe(
    map(([requisitions, reqstatus, cylstatus]) => requisitions.map(requisition => this.requisitionMap(requisition, reqstatus, cylstatus)))
  );

  private currentRequisitionSubject = new BehaviorSubject<Requisition>(null);
  public currentRequisition$ = this.currentRequisitionSubject.asObservable();

  private userActionSubject = new BehaviorSubject<string>(null);
  private userAction$ = this.userActionSubject.asObservable();

  public currentActionWithData$ = combineLatest([
    this.userAction$,
    this.currentRequisition$
  ]).pipe(
    map(([action, requisition]) => {
      if (action === 'edit') {
        return {
          action,
          requisition
        };
      } else {
        return { action };
      }
    })
  );

  public setCurrentRequisition(requisition: Requisition): void {
    this.currentRequisitionSubject.next(requisition);
  }

  public setCurrentAction(action: string): void {
    this.userActionSubject.next(action);
  }

  public setSearchPayload(payload: string): void {
    this.searchActionSubject.next(payload);
  }

  public setErrorMessage(message: string): void {
    this.reqErrorMessageSubject.next(message);
  }

  public createOrUpdateRequisition(reqNumber: number, payload: any, action: string) {
    if (action === 'edit') {
      return this.http.patch<Requisition>(this.restconfig.updateRequisition(reqNumber), payload).pipe(
        catchError(err => {
          this.reqErrorMessageSubject.next(err.error.error);
          return EMPTY;
        })
      );
    } else {
      return this.http.post<Requisition>(this.restconfig.createRequisition(), payload).pipe(
        catchError(err => {
          this.reqErrorMessageSubject.next(err.error.error);
          return EMPTY;
        })
      );
    }
  }

  public getFormattedDate(dt: Date): string {
    if (!dt) {
      return '';
    }
    const dd = (dt.getDate()) > 9 ? dt.getDate() : `0${dt.getDate()}`;
    const mm = (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : `0${dt.getMonth() + 1}`;
    const yyyy = dt.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }

  private requisitionMap(requisition: Requisition, reqstatus: Status[], cylstatus: Status[]) {
    requisition.DisplayRequisitionStatus = reqstatus.find(status => status.LookupKey === requisition.RequisitionStatus).LookupValue;
    requisition.DisplayCylinderStatus = !!requisition.CylinderStatus ?
                                          cylstatus.find(status => status.LookupKey === requisition.CylinderStatus).LookupValue : '';
    return requisition;
  }
}

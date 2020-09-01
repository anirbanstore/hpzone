import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RequisitionService } from './../requisition.service';

import { Requisition } from './../../shared/model/requisition.interface';
import { ActionForm } from './../../shared/model/action.interface';
import { AppState, getError } from './../../state/app.reducer';
import * as AppActions from './../../state/app.action';

@Component({
  selector: 'hpz-reqview',
  templateUrl: './reqview.component.html',
  styleUrls: ['./reqview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqviewComponent implements OnInit, OnDestroy {

  constructor(private requisitionService: RequisitionService, private store: Store<AppState>) { }

  public requisition: Requisition;
  public requisitionForm: FormGroup;
  public mode: string;
  public pageTitle: string;
  public reqErrorMessage$: Observable<string>;

  private currentRequisition$ = this.requisitionService.currentActionWithData$;
  private requisitionSubscription: Subscription;

  public requisitionStatus$ = this.requisitionService.requisitionStatus$;
  public cylinderStatus$ = this.requisitionService.cylinderStatus$;

  ngOnInit() {
    this.reqErrorMessage$ = this.store.select(getError);
    this.requisitionSubscription = this.currentRequisition$.subscribe({
      next: (data: ActionForm) => {
        this.requisition = data.requisition;
        this.mode = data.action;
      }
    });
    const editMode = this.mode === 'edit';
    this.pageTitle = editMode ? `Edit Requisition # ${this.requisition.ReqNumber}` : 'New Requisition';

    this.requisitionForm = new FormGroup({
      ReqNumber: new FormControl({
        value: editMode ? this.requisition.ReqNumber : '',
        disabled: editMode
      }, Validators.required),
      ReqDate: new FormControl({
        value: editMode ? this.requisitionService.getFormattedDate(new Date(this.requisition.ReqDate)) : '',
        disabled: editMode
      }, Validators.required),
      DeliveryDate: new FormControl({
        value: editMode ? ((this.requisition.DeliveryDate !== null && this.requisition.DeliveryDate !== undefined) ?
                           this.requisitionService.getFormattedDate(new Date(this.requisition.DeliveryDate)) : '' ) : '',
        disabled: editMode ? (this.requisition.RequisitionStatus !== 'HP_DELIVER' || this.requisition.CylinderStatus === 'HP_RETURN') : true
      }, Validators.required),
      RequisitionStatus: new FormControl({
        value: editMode ? this.requisition.RequisitionStatus || '' : 'HP_ORDER',
        disabled: editMode ? (this.requisition.RequisitionStatus === 'HP_CANCEL' || this.requisition.CylinderStatus === 'HP_RETURN') : false
      }),
      OrderNumber: new FormControl({
        value: editMode ? this.requisition.OrderNumber : '',
        disabled: editMode && ((this.requisition.OrderNumber !== null && this.requisition.OrderNumber !== undefined) || this.requisition.RequisitionStatus === 'HP_CANCEL')
      }),
      CylinderStatus: new FormControl({
        value: editMode ? this.requisition.CylinderStatus || '' : '',
        disabled: editMode && (this.requisition.RequisitionStatus === 'HP_CANCEL' || this.requisition.CylinderStatus === 'HP_RETURN')
      }),
      ReqAmount: new FormControl({
        value: editMode ? this.requisition.ReqAmount : '',
        disabled: editMode && ((this.requisition.ReqAmount !== null && this.requisition.ReqAmount !== undefined) || this.requisition.RequisitionStatus === 'HP_CANCEL')
      }),
      Usage: new FormControl({
        value: editMode ? this.requisition.Usage : '',
        disabled: true
      })
    });
  }

  ngOnDestroy() {
    if (!!this.requisitionSubscription) {
      this.requisitionSubscription.unsubscribe();
    }
  }

  createOrUpdateRequisition(): void {
    const payload = this.buildPayload();
    const reqNumber = this.requisitionForm.value.ReqNumber || this.requisition.ReqNumber;
    this.store.dispatch(AppActions.saveAction({ reqNumber, payload, action: this.mode }));
  }

  onRequisitionStatusChange(event: any) {
    const RequisitionStatus = event.target.value;
    if (RequisitionStatus === 'HP_DELIVER') {
      this.requisitionForm.get('DeliveryDate').enable();
      if (this.mode === 'edit') {
        this.requisitionForm.patchValue({
          DeliveryDate: (this.requisition.DeliveryDate !== null && this.requisition.DeliveryDate !== undefined)
                       ? this.requisitionService.getFormattedDate(new Date(this.requisition.DeliveryDate)) : ''
        });
      }
    } else {
      this.requisitionForm.get('DeliveryDate').disable();
      this.requisitionForm.patchValue({
        DeliveryDate: ''
      });
    }
  }

  private buildPayload(): Requisition {
    const payload = {
      ...this.requisitionForm.value,
      Usage: undefined,
      DeliveryDate: undefined
    };
    const ReqDate = this.requisitionForm.value.ReqDate || this.requisitionService.getFormattedDate(new Date(this.requisition.ReqDate));
    let DeliveryDate: string;
    if (this.mode === 'edit') {
      if (!!this.requisitionForm.value.DeliveryDate) {
        DeliveryDate = this.requisitionForm.value.DeliveryDate;
      } else if (this.requisition.DeliveryDate !== null && this.requisition.DeliveryDate !== undefined) {
        DeliveryDate = this.requisitionService.getFormattedDate(new Date(this.requisition.DeliveryDate));
      }
    } else {
      DeliveryDate = !!this.requisitionForm.value.DeliveryDate ? this.requisitionService.getFormattedDate(new Date(this.requisitionForm.value.DeliveryDate)) : null;
    }
    if (!!DeliveryDate) {
      payload.DeliveryDate = (new Date(DeliveryDate)).getTime();
    }
    payload.ReqDate = (ReqDate !== null && ReqDate !== undefined) ? (new Date(ReqDate).getTime()) : null;
    return payload;
  }

}

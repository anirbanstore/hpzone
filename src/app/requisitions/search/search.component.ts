import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { RequisitionService } from '../requisition.service';
import { AppState } from './../../state/app.reducer';
import * as AppActions from './../../state/app.action';

@Component({
  selector: 'hpz-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  constructor(
    private requisitionService: RequisitionService,
    private store: Store<AppState>
  ) {}

  public pageTitle = 'Search';
  public searchForm: FormGroup;

  public requisitionStatus$ = this.requisitionService.requisitionStatus$;
  public cylinderStatus$ = this.requisitionService.cylinderStatus$;

  ngOnInit() {
    this.searchForm = new FormGroup({
      ReqNumber: new FormControl(''),
      OrderNumber: new FormControl(''),
      ReqStartDate: new FormControl(''),
      ReqEndDate: new FormControl(''),
      DelStartDate: new FormControl(''),
      DelEndDate: new FormControl(''),
      RequisitionStatus: new FormControl(''),
      CylinderStatus: new FormControl('')
    });
  }

  public onSearch(): void {
    const searchPayload = { ...this.searchForm.value };
    if (!!this.searchForm.value.ReqStartDate) {
      searchPayload.ReqStartDate = new Date(
        this.searchForm.value.ReqStartDate
      ).getTime();
    }
    if (!!this.searchForm.value.ReqEndDate) {
      searchPayload.ReqEndDate = new Date(
        this.searchForm.value.ReqEndDate
      ).getTime();
    }
    if (!!this.searchForm.value.DelStartDate) {
      searchPayload.DelStartDate = new Date(
        this.searchForm.value.DelStartDate
      ).getTime();
    }
    if (!!this.searchForm.value.DelEndDate) {
      searchPayload.DelEndDate = new Date(
        this.searchForm.value.DelEndDate
      ).getTime();
    }
    const params = Object.keys(searchPayload);
    let searchQuery = '';
    params.forEach((param, index) => {
      if (!!searchPayload[param]) {
        if (index !== params.length - 1) {
          searchQuery += param + ':' + searchPayload[param] + ';';
        } else {
          searchQuery += param + ':' + searchPayload[param];
        }
      }
    });
    if (!!searchQuery) {
      if (searchQuery.endsWith(';')) {
        searchQuery = searchQuery.substring(0, searchQuery.length - 1);
      }
      this.store.dispatch(
        AppActions.searchAction({ payload: 'filter=' + searchQuery })
      );
    } else {
      this.store.dispatch(AppActions.searchAction({ payload: null }));
    }
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.store.dispatch(AppActions.clearSearchAction());
  }
}

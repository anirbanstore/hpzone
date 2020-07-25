import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { RequisitionService } from './requisition.service';

@Component({
  selector: 'hpz-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrls: ['./requisitions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisitionsComponent implements OnInit {

  constructor(private requisitionService: RequisitionService, private router: Router) { }

  pageTitle = 'Requisitions';
  public requisition$;

  ngOnInit() {
    this.requisition$ = this.requisitionService.requisitionWithStatusAndSearch$;
  }

  createRequisition(): void {
    this.requisitionService.setCurrentAction('new');
    this.requisitionService.setCurrentRequisition(null);
    this.router.navigate(['view']);
  }

}

import { Router } from '@angular/router';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { RequisitionService } from '../requisition.service';

import { Requisition } from './../../shared/model/requisition.interface';

@Component({
  selector: 'hpz-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent implements OnInit {

  @Input() requisition: Requisition;

  constructor(private router: Router, private requisitionService: RequisitionService) { }

  ngOnInit() {
  }

  public editRequisition(requisition: Requisition): void {
    this.requisitionService.setCurrentAction('edit');
    this.requisitionService.setCurrentRequisition(requisition);
    this.router.navigate(['view']);
  }

}

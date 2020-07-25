import { Requisition } from './requisition.interface';

export interface ActionForm {
  action: string;
  requisition?: Requisition;
}

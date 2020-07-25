export interface Requisition {
  ReqNumber: number;
  ConsumerNumber: number;
  ReqDate: number;
  DeliveryDate: number;
  RequisitionStatus: string;
  DisplayRequisitionStatus?: string;
  OrderNumber?: number;
  ReqAmount?: number;
  Usage?: number;
  CylinderStatus?: string;
  DisplayCylinderStatus?: string;
  ReqCreatedBy: string;
  ReqUpdatedBy: string;
}

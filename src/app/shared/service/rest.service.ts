import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private env: EnvironmentService) {}

  signin(): string {
    return `${this.getRestHost()}/user/login`;
  }

  signout(): string {
    return `${this.getRestHost()}/user/logout`;
  }

  getRequisitions(reqNumber?: number): string {
    const fetchAllRequisitions = reqNumber === null || reqNumber === undefined;
    const root = `${this.getRestHost()}/requisition`;
    return fetchAllRequisitions ? root : `${root}/${reqNumber}`;
  }

  getSearchedRequisitions(filter?: string): string {
    if (!!filter) {
      return `${this.getRestHost()}/requisition?${filter}`;
    }
    return `${this.getRestHost()}/requisition`;
  }

  createRequisition(): string {
    return `${this.getRestHost()}/requisition`;
  }

  updateRequisition(reqNumber: number): string {
    return `${this.getRestHost()}/requisition/${reqNumber}`;
  }

  getStatus(): string {
    return `${this.getRestHost()}/status`;
  }

  private getRestHost(): string {
    return this.env.getEndPoint() + this.env.getBasePath();
  }
}

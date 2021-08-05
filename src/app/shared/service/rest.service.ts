import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private env: EnvironmentService) {}

  public signin(): string {
    return `${this.getRestHost()}/user/login`;
  }

  public signout(): string {
    return `${this.getRestHost()}/user/logout`;
  }

  public getRequisitions(reqNumber?: number): string {
    const fetchAllRequisitions = reqNumber === null || reqNumber === undefined;
    const root = `${this.getRestHost()}/requisition`;
    return fetchAllRequisitions ? root : `${root}/${reqNumber}`;
  }

  public getSearchedRequisitions(filter?: string): string {
    if (!!filter) {
      return `${this.getRestHost()}/requisition?${filter}`;
    }
    return `${this.getRestHost()}/requisition`;
  }

  public createRequisition(): string {
    return `${this.getRestHost()}/requisition`;
  }

  public updateRequisition(reqNumber: number): string {
    return `${this.getRestHost()}/requisition/${reqNumber}`;
  }

  public getStatus(): string {
    return `${this.getRestHost()}/status`;
  }

  private getRestHost(): string {
    return this.env.getEndPoint() + this.env.getBasePath();
  }
}

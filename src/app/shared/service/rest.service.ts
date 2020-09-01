import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private BASE_PATH = '/api/v1';
  private DEV_HOST = 'http://localhost:3000';
  private PROD_HOST = 'https://hpzone-server.herokuapp.com';

  constructor(private env: EnvironmentService) {}

  public signin(): string {
    return `${this.getRestHost()}/user/login`;
  }

  public signout(): string {
    return `${this.getRestHost()}/user/logout`;
  }

  public getRequisitions(reqNumber?: number): string {
    const fetchAllRequisitions = (reqNumber === null || reqNumber === undefined);
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
    // if (this.env.isProd()) {
    //   return this.PROD_HOST + this.BASE_PATH;
    // }
    // return this.DEV_HOST + this.BASE_PATH;
    return this.PROD_HOST + this.BASE_PATH;
  }
}

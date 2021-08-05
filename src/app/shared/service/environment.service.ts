import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  isProd(): boolean {
    return environment.production;
  }

  getBasePath(): string {
    return environment.config.basePath;
  }

  getEndPoint(): string {
    return environment.config.endPoint;
  }
}

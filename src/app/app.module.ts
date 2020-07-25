import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/module/shared.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RequestInterceptorService } from './shared/service/req-interceptor.service';

import { HPDatePipe } from './shared/pipe/date.pipe';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './auth/signin/signin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchComponent } from './requisitions/search/search.component';
import { ResultComponent } from './requisitions/result/result.component';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { ReqviewComponent } from './requisitions/reqview/reqview.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SigninComponent,
    PageNotFoundComponent,
    RequisitionsComponent,
    ReqviewComponent,
    SearchComponent,
    ResultComponent,
    HPDatePipe
  ],
  imports: [
    BrowserModule,
    SharedModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/module/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RequestInterceptorService } from './shared/service/req-interceptor.service';

import { HPDatePipe } from './shared/pipe/date.pipe';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { reducer } from './state/app.reducer';
import { AppEffects } from './state/app.effect';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './auth/signin/signin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchComponent } from './requisitions/search/search.component';
import { ResultComponent } from './requisitions/result/result.component';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { ReqviewComponent } from './requisitions/reqview/reqview.component';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    BrowserAnimationsModule,
    SharedModule,
    StoreModule.forRoot({ hpz: reducer }, {}),
    environment.production ? [] : StoreDevtoolsModule.instrument({
      name: 'Hpzone App Devtools',
      maxAge: 25
    }),
    EffectsModule.forRoot([ AppEffects ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

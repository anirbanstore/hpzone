import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './auth/auth-guard.service';

import { SigninComponent } from './auth/signin/signin.component';
import { RequisitionsComponent } from './requisitions/requisitions.component';
import { ReqviewComponent } from './requisitions/reqview/reqview.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  {
    path: 'requisition',
    component: RequisitionsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'view',
    component: ReqviewComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'notfound', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

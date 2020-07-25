import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
      CommonModule,
      NgxLoadingModule.forRoot({
          animationType: ngxLoadingAnimationTypes.circle,
          backdropBackgroundColour: 'rgba(0,0,0,0.25)',
          backdropBorderRadius: '1px',
          primaryColour: '#11C26D',
          secondaryColour: '#3F51B5',
          tertiaryColour: '#FAD55C',
          fullScreenBackdrop: true
      })
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      NgxLoadingModule,
      AppRoutingModule
    ]
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@NgModule({
    imports: [
      CommonModule,
      NgxSpinnerModule
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      NgxSpinnerModule,
      AppRoutingModule
    ],
    providers: [NgxSpinnerService]
})
export class SharedModule {}

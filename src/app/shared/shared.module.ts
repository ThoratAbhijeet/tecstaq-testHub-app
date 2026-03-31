import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [],
  providers:[DatePipe],
  imports: [
    CommonModule,
    FormsModule,    
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    NgOtpInputModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
   exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatInputModule,
    NgOtpInputModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
    
  ]
})
export class SharedModule { }

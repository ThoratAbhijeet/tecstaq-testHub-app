import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { TestComponent } from './test/test.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TestComponent,
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule  
  ]
})
export class StudentModule { }

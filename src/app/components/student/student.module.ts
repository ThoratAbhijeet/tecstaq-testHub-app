import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { TestComponent } from './test/test.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { AddUpdateStudentTestComponent } from './test/add-update-student-test/add-update-student-test.component';
import { TestResultComponent } from './test/test-result/test-result.component';


@NgModule({
  declarations: [
    TestComponent,
    StudentDashboardComponent,
    AddUpdateStudentTestComponent,
    TestResultComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule  
  ]
})
export class StudentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { StudentComponent } from './student/student.component';
import { AddUpdateStudentComponent } from './student/add-update-student/add-update-student.component';
import { ViewStudentComponent } from './student/view-student/view-student.component';
import { GroupComponent } from './group/group.component';
import { AddUpdateGroupComponent } from './group/add-update-group/add-update-group.component';
import { ViewGroupComponent } from './group/view-group/view-group.component';
import { UserComponent } from './user/user.component';
import { TestComponent } from './test/test.component';
import { AddUpdateTestComponent } from './test/add-update-test/add-update-test.component';
import { ViewTestComponent } from './test/view-test/view-test.component';
import { QuetionTypeComponent } from './quetion/quetion-type/quetion-type.component';
import { AddUpdateQuetionTypeComponent } from './quetion/quetion-type/add-update-quetion-type/add-update-quetion-type.component';
import { ViewQuetionTypeComponent } from './quetion/quetion-type/view-quetion-type/view-quetion-type.component';
import { QuestionnaireComponent } from './quetion/questionnaire/questionnaire.component';
import { AddUpdateQuestionnaireComponent } from './quetion/questionnaire/add-update-questionnaire/add-update-questionnaire.component';
import { ViewQuestionnaireComponent } from './quetion/questionnaire/view-questionnaire/view-questionnaire.component';
import { StudentReportComponent } from './reports/student-report/student-report.component';
import { TestReportComponent } from './reports/test-report/test-report.component';
import { TestResultsComponent } from './test/test-results/test-results.component';
import { ResultReportComponent } from './reports/result-report/result-report.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    StudentComponent,
    AddUpdateStudentComponent,
    ViewStudentComponent,
    GroupComponent,
    AddUpdateGroupComponent,
    ViewGroupComponent,
    UserComponent,
    TestComponent,
    AddUpdateTestComponent,
    ViewTestComponent,
    QuetionTypeComponent,
    AddUpdateQuetionTypeComponent,
    ViewQuetionTypeComponent,
    QuestionnaireComponent,
    AddUpdateQuestionnaireComponent,
    ViewQuestionnaireComponent,
    StudentReportComponent,
    TestReportComponent,
    TestResultsComponent,
    ResultReportComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }

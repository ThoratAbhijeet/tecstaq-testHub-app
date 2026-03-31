import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from '../../shared/auth-guard.service';
import { StudentComponent } from './student/student.component';
import { AddUpdateStudentComponent } from './student/add-update-student/add-update-student.component';
import { ViewStudentComponent } from './student/view-student/view-student.component';
import { GroupComponent } from './group/group.component';
import { AddUpdateGroupComponent } from './group/add-update-group/add-update-group.component';
import { ViewGroupComponent } from './group/view-group/view-group.component';
import { ViewTestComponent } from './test/view-test/view-test.component';
import { AddUpdateTestComponent } from './test/add-update-test/add-update-test.component';
import { TestComponent } from './test/test.component';
import { QuetionTypeComponent } from './quetion/quetion-type/quetion-type.component';
import { ViewQuetionTypeComponent } from './quetion/quetion-type/view-quetion-type/view-quetion-type.component';
import { AddUpdateQuetionTypeComponent } from './quetion/quetion-type/add-update-quetion-type/add-update-quetion-type.component';
import { QuestionnaireComponent } from './quetion/questionnaire/questionnaire.component';
import { AddUpdateQuestionnaireComponent } from './quetion/questionnaire/add-update-questionnaire/add-update-questionnaire.component';
import { ViewQuestionnaireComponent } from './quetion/questionnaire/view-questionnaire/view-questionnaire.component';

const routes: Routes = [
    { path: "", redirectTo: "admin", pathMatch: "full" },
  {
    path: "admin-dashboard",
    component: AdminDashboardComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "student",
    component:StudentComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]

  },
   {
    path: "add-student",
    component: AddUpdateStudentComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "edit-student/:id",
    component: AddUpdateStudentComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "view-student/:id",
    component: ViewStudentComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
    {
    path: "group",
    component:GroupComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]

  },
   {
    path: "add-group",
    component: AddUpdateGroupComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "edit-group/:id",
    component: AddUpdateGroupComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "view-group/:id",
    component: ViewGroupComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "test",
    component: TestComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]

  },
   {
    path: "add-test",
    component: AddUpdateTestComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "edit-test/:id",
    component: AddUpdateTestComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "view-test/:id",
    component: ViewTestComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
    {
    path: "quetion-type",
    component: QuetionTypeComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]

  },
   {
    path: "add-quetion-type",
    component: AddUpdateQuetionTypeComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "edit-quetion-type/:id",
    component: AddUpdateQuetionTypeComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "view-quetion-type/:id",
    component: ViewQuetionTypeComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
   {
    path: "questionnaire",
    component: QuestionnaireComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]

  },
   {
    path: "add-questionnaire",
    component: AddUpdateQuestionnaireComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "edit-questionnaire/:id",
    component: AddUpdateQuestionnaireComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
  {
    path: "view-questionnaire/:id",
    component: ViewQuestionnaireComponent,
    pathMatch: "full",
    outlet: "admin_menu",
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

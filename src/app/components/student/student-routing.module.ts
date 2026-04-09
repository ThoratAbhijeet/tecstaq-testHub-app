import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { AuthGuard } from '../../shared/auth-guard.service';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AddUpdateStudentTestComponent } from './test/add-update-student-test/add-update-student-test.component';
import { TestResultComponent } from './test/test-result/test-result.component';

const routes: Routes = [
   { path: "", redirectTo: "student", pathMatch: "full" },
    {
      path: "student-dashboard",
      component: StudentDashboardComponent,
      pathMatch: "full",
      outlet: "student_menu",
      canActivate: [AuthGuard]
    },
    {
      path: "test",
      component:TestComponent,
      pathMatch: "full",
      outlet: "student_menu",
      canActivate: [AuthGuard]
  
    },
      {
        path: "attempt-test/:id",
        component: AddUpdateStudentTestComponent,
        pathMatch: "full",
        outlet: "student_menu",
        canActivate: [AuthGuard]
      },
      {
      path: "test-result",
      component:TestResultComponent,
      pathMatch: "full",
      outlet: "student_menu",
      canActivate: [AuthGuard]
  
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

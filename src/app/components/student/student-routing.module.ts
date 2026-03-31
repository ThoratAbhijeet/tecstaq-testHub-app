import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { AuthGuard } from '../../shared/auth-guard.service';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';

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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

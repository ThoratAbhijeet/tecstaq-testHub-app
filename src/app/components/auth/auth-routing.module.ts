import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
    {
    path: "",
    redirectTo: "auth",
    pathMatch:'full'
  },
  {
    path: "auth",
    component: LoginComponent,
    pathMatch: "full",
  }, 
    {
    path: "sign-up",
    component: SignUpComponent,
    pathMatch: "full",
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

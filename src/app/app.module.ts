import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminSidebarComponent } from './sidebar/admin-sidebar/admin-sidebar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './shared/auth-interceptor.service';
import { AuthGuard } from './shared/auth-guard.service';
import { StudentSidebarComponent } from './sidebar/student-sidebar/student-sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminSidebarComponent,
    StudentSidebarComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
     HttpClientModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 6000,
     positionClass: 'toast-top-right', 
      preventDuplicates: true,
      closeButton: true
    }),
  ],
  providers: [
     AuthGuard,
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

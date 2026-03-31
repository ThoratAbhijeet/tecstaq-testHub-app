import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  password: string = '';
  passwordVisible: boolean = false;
  isSubmitted = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _toastrService: ToastrService,
    private _sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    localStorage.clear();
  }
  createForm() {
    this.LoginForm = this.fb.group({
      email_id: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/)
      ]],
      password: [null, Validators.required]
    });

  }

  get controls() {
    return this.LoginForm.controls;
  }

  login() {
    let data = this.LoginForm.value;
    this.isSubmitted = true;
    localStorage.clear();
    if (this.LoginForm.valid) {
      this._sharedService.setLoading(true)
      this._authService.login(data).subscribe({

        next: (res: any) => {

          localStorage.setItem('accessToken', res.token);
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("user_name", res.data.user_name);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem('expiresIn', res.expiresIn);
          localStorage.setItem('isLogin', 'true');
          if (res.status == 200 || res.status == 201) {
            localStorage.setItem('user', JSON.stringify(res.data));
            this._toastrService.clear();
            //  && res.user.designation_id == 1
            if (res.data.role == 'admin') {
              this.router.navigate(['/admin', { outlets: { admin_menu: 'admin-dashboard' } }]);
            }  else if (res.user.role === 'student') {
              this.router.navigate(['/student', { outlets: { student_menu: 'student-dashboard' } }]);
            } else {
              this._toastrService.warning('Unauthorized');
              this.router.navigate(['/auth']);
            }

            this._sharedService.setLoading(false)
            this._toastrService.success(res.message);

          } else {
            this._toastrService.warning(res.message);
          }
        },
        error: (error: any) => {

          if (error.error.status == 422) {
            this._toastrService.warning(error.error.message);
          } else {
            this._toastrService.error(error.error.message);

          }
        },
      })

    } else {
      this.LoginForm.markAllAsTouched();
      this._toastrService.warning('Please fill required fields');
    }
  }
  //password show and hide
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}

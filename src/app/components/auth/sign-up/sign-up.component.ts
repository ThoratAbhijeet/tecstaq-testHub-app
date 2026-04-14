import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { SharedService } from '../../../shared/shared.service';
import { AdminService } from '../../admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  isEdit = false;
  StudentForm!: FormGroup;
  Student_Id: any;
  allGroupList: Array<any> = [];
  searchGroupValue: string = '';
  filteredGroupList: any[] = [];
  allTestList: Array<any> = [];
  searchTestValue: string = '';
  filteredTestList: any[] = [];
  group_id: any;
  selectedUploadType: any;
  allGenderList = environment.allGenderList;
  allCourseYearList = environment.allCourseYearList;
  allRoleList = environment.allRoleList;
  constructor(
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private _adminService: AdminService,
    private _sharedService: SharedService,
    private url: ActivatedRoute,
    private location: Location,
  ) { }
  ngOnInit(): void {
    this.createForm();
    this.Student_Id = this.url.snapshot.params['id'];
    this.getAllGroupListWma();
  }
  onPhoneInput(value: string) {
    const phonePattern = /^[0-9]{10}$/;
  }
  //employee form
  createForm() {
    this.StudentForm = this.fb.group({
      group_id: [''],
      test_id: [''],
      student_name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/)]],
      phone_number: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      gender: ['', Validators.required],
      college_name: ['', Validators.required],
      course: ['', Validators.required],
      course_year: ['', Validators.required],
      role: ['student'],
    })
  }

  get controls() {
    return this.StudentForm.controls
  }

  submit() {
    this.addStudent()
  }
  //only 10 digit mob. no 
  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  //add Student
  addStudent() {
    let data = this.StudentForm.value;
    if (this.StudentForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.addStudent(data).subscribe({
        next: (res: any) => {
          if (res.status == 201 || res.status == 200) {

            Swal.fire({
              icon: 'success',
              title: 'Thank You!', 
              text: 'You will receive an email 15 minutes before the test. Use the ID and password provided in the email to log in and attend the test.',
              confirmButtonText: 'OK',
              allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.goToback();
              }
            });

          } else {
            this._toastrService.warning(res.message)
          }
          this._sharedService.setLoading(false);
        },
        error: (err: any) => {
          this._sharedService.setLoading(false);
          if (err.error.status == 422) {
            this._toastrService.warning(err.error.message)
          } else {
            this._toastrService.error('Internal Server Error')
          }
        }
      })
    } else {
      this.StudentForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }

  getAllGroupListWma() {
    this._adminService.getAllGroupListWma().subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allGroupList = res.data;
          this.filteredGroupList = this.allGroupList;
        }
      }
    });
  }

  filterGroup() {
    if (this.searchGroupValue !== '') {
      this.filteredGroupList = this.allGroupList.filter(project =>
        project.group_name.toLowerCase().includes(this.searchGroupValue.toLowerCase())
      );
    } else {
      this.filteredGroupList = this.allGroupList;
    }
  }
  onGroupChange(event: any) {
    const groupId = event.value;
    this.group_id = groupId;

    this.getAllTestListWma(this.group_id);
  }
  getAllTestListWma(id: any) {
    this._adminService.getAllTestListWma(id).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allTestList = res.data;
          this.filteredTestList = this.allTestList;
        }
      }
    });
  }

  filterTest() {
    if (this.searchTestValue !== '') {
      this.filteredTestList = this.allTestList.filter(project =>
        project.test_name.toLowerCase().includes(this.searchTestValue.toLowerCase())
      );
    } else {
      this.filteredTestList = this.allTestList;
    }
  }

  // cancel route location Group
  goToback() {
    this.location.back();
  }

}

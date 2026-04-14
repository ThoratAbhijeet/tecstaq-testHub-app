import { environment } from './../../../../../environments/environment.development';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../admin.service';
import { SharedService } from '../../../../shared/shared.service';
import { Observable, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-update-student',
  templateUrl: './add-update-student.component.html',
  styleUrl: './add-update-student.component.scss'
})
export class AddUpdateStudentComponent implements OnInit {
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
  selectedUploadType:any;
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
    //activate route get employee id
    if (this.Student_Id) {
      this.getStudentById(this.Student_Id);
      this.isEdit = true
    }

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
      role: ['student', Validators.required],
       file: [''],
    })
  }

  get controls() {
    return this.StudentForm.controls
  }

  submit() {
    this.isEdit ? this.editStudent() : this.addStudent()
  }
  //only 10 digit mob. no 
  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  //update Student
  editStudent() {
    let data = this.StudentForm.getRawValue();
    if (this.StudentForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.editStudent(this.Student_Id, data).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this._toastrService.success(res.message);
            this.goToback();
          } else {
            this._toastrService.warning(res.message)
          }
          this._sharedService.setLoading(false);
        },
        error: (err: any) => {
          this._sharedService.setLoading(false);
          if (err.error.status == 401 || err.error.status == 422) {
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
  //add Student
  addStudent() {
    let data = this.StudentForm.value;
    if (this.StudentForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.addStudent(data).subscribe({
        next: (res: any) => {
          if (res.status == 201 || res.status == 200) {
            this._toastrService.success(res.message)
            this.goToback();
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
  //get employee by id
  getStudentById(id: any) {
    this._adminService.getStudentById(id).subscribe({
      next: (result: any) => {
        const StudentData = result.data;
        this.getAllTestListWma(StudentData.group_id);
        // Patch main fields
        this.controls['group_id'].patchValue(StudentData.group_id);
        this.controls['test_id'].patchValue(StudentData.test_id);
        this.controls['student_name'].patchValue(StudentData.student_name);
        this.controls['email_id'].patchValue(StudentData.email_id);
        this.controls['phone_number'].patchValue(StudentData.phone_number);
        this.controls['gender'].patchValue(StudentData.gender);
        this.controls['college_name'].patchValue(StudentData.college_name);
        this.controls['course'].patchValue(StudentData.course);
        this.controls['course_year'].patchValue(StudentData.course_year);
        this.controls['role'].patchValue(StudentData.role);
      }
    });
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
uploadExcel() {
  if (!this.controls['file'].value) {
    alert("Please select file");
    return;
  }
  const payload = {
    file: this.controls['file'].value,
  };
 if (payload) {
      this._sharedService.setLoading(true);
      this._adminService.uploadStudent(payload).subscribe({
            next: (res: any) => {
              if (res.status == 200) {
                this._toastrService.success(res.message);
                this.goToback();
              } else {
                this._toastrService.warning(res.message);
              }
            },
            error: (err: any) => {
              if (err.error.status == 422) {
                this._toastrService.warning(err.error.message);
              } else {
                this._toastrService.error(err.error.message);
              }
            },
          });
    } else {
      this.StudentForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
}
onFileSelect(event: any) {
  const file = event.target.files[0];
  const control = this.StudentForm.get('file');

  if (!file) return;

  const allowedExtensions = ['xls', 'xlsx'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  let errors: any = {};

  // ❌ Extension check
  if (!allowedExtensions.includes(fileExtension!)) {
    errors.invalidType = true;
  }

  // ❌ Size check
  if (file.size > maxSize) {
    errors.fileSizeExceeded = true;
  }

  if (Object.keys(errors).length > 0) {
    control?.setErrors(errors);
    control?.markAsTouched();
    return;
  }

  // ✅ VALID FILE
  control?.setErrors(null);
  control?.patchValue(file);

  // 👉 optional base64
  this.convertFile(file).subscribe((base64) => {
    this.controls['file']?.patchValue(base64);
  });
}
 convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }
onSubmit() {
    let data = this.StudentForm.value
    if (data) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to Submit?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {

          this._adminService.uploadStudent(this.StudentForm.value).subscribe({
            next: (res: any) => {
              if (res.status == 200) {
                this._toastrService.success(res.message);
              } else {
                this._toastrService.warning(res.message);
              }
            },
            error: (err: any) => {
              if (err.error.status == 422) {
                this._toastrService.warning(err.error.message);
              } else {
                this._toastrService.error(err.error.message);
              }
            },
          });

        }
      });

    } else {
      this._toastrService.warning('Fill required fields');
      this.StudentForm.markAllAsTouched();
    }



}
}

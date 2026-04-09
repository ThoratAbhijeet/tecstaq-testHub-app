import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../../shared/shared.service';
import { AdminService } from '../../../admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-quetion-type',
  templateUrl: './add-update-quetion-type.component.html',
  styleUrl: './add-update-quetion-type.component.scss'
})
export class AddUpdateQuetionTypeComponent implements OnInit {
  isEdit = false;
  QuetionTypeForm!: FormGroup;
  QuetionType_Id: any;
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
    this.QuetionType_Id = this.url.snapshot.params['id'];
    //activate route get employee id
    if (this.QuetionType_Id) {
      this.getQuetionTypeById(this.QuetionType_Id);
      this.isEdit = true
    }

  }

  //employee form
  createForm() {
    this.QuetionTypeForm = this.fb.group({
      question_type: ['', Validators.required],
      description: ['', Validators.required],

    })
  }
  get controls() {
    return this.QuetionTypeForm.controls
  }

  submit() {
    this.isEdit ? this.editQuetionType() : this.addQuetionType()
  }
  //only 10 digit mob. no 
  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  //update QuetionType
  editQuetionType() {
    let data = this.QuetionTypeForm.getRawValue();
    if (this.QuetionTypeForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.editQuetionType(this.QuetionType_Id, data).subscribe({
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
      this.QuetionTypeForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //add QuetionType
  addQuetionType() {
    let data = this.QuetionTypeForm.value;
    if (this.QuetionTypeForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.addQuetionType(data).subscribe({
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
      this.QuetionTypeForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //get employee by id
getQuetionTypeById(id: any) {
  this._adminService.getQuetionTypeById(id).subscribe({
    next: (result: any) => {
      const QuetionTypeData = result.data;

      // Patch main fields
      this.controls['question_type'].patchValue(QuetionTypeData.question_type);
      this.controls['description'].patchValue(QuetionTypeData.description);
    }
  });
}


  // cancel route location QuetionType
  goToback() {
    this.location.back();
  }


}

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import { AdminService } from '../../admin.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-update-group',
  templateUrl: './add-update-group.component.html',
  styleUrl: './add-update-group.component.scss'
})
export class AddUpdateGroupComponent implements OnInit {
  isEdit = false;
  GroupForm!: FormGroup;
  Group_Id: any;
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
    this.Group_Id = this.url.snapshot.params['id'];
    //activate route get employee id
    if (this.Group_Id) {
      this.getGroupById(this.Group_Id);
      this.isEdit = true
    }

  }
   onPhoneInput(value: string) {
    const phonePattern = /^[0-9]{10}$/;
  }
  //employee form
  createForm() {
    this.GroupForm = this.fb.group({
      group_name: ['', Validators.required],
      description: ['', Validators.required],

    })
  }
  get controls() {
    return this.GroupForm.controls
  }

  submit() {
    this.isEdit ? this.editGroup() : this.addGroup()
  }
  //only 10 digit mob. no 
  allowOnlyDigits(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  //update Group
  editGroup() {
    let data = this.GroupForm.getRawValue();
    if (this.GroupForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.editGroup(this.Group_Id, data).subscribe({
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
      this.GroupForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //add Group
  addGroup() {
    let data = this.GroupForm.value;
    if (this.GroupForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.addGroup(data).subscribe({
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
      this.GroupForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //get employee by id
getGroupById(id: any) {
  this._adminService.getGroupById(id).subscribe({
    next: (result: any) => {
      const GroupData = result.data;

      // Patch main fields
      this.controls['group_name'].patchValue(GroupData.group_name);
      this.controls['description'].patchValue(GroupData.description);
    }
  });
}


  // cancel route location Group
  goToback() {
    this.location.back();
  }


}

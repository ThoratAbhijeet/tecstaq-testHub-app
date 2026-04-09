import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AdminService } from '../admin.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent implements OnInit {
  allStudentList: Array<any> = [];
  form!: FormGroup;
  page = 1;
  limit = 50;
  total = 0;
  searchKey: any = '';
  group_id:any;
  searchControl: FormControl = new FormControl('');
    allGroupList: Array<any> = [];
  searchGroupValue: string = '';
  filteredGroupList: any[] = [];
  constructor(
    private _adminService: AdminService,
    private _tosterService: ToastrService,private fb: FormBuilder,) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getStudentList();
    this.getAllGroupListWma();
       this.searchControl.valueChanges.pipe(debounceTime(550)).subscribe((searchKey) => {
          this.getSearchInput(searchKey);
        });
  }
    createForm() {
    this.form = this.fb.group({
      group_id: [''],  
    });
  }
     getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getStudentList();
  }
  onGroupChange(event: any) {
  const groupId = event.value;
  this.group_id = groupId;

  this.getStudentList();
}
  getStudentList() {
     this.group_id = this.form.value.group_id;
    this._adminService.getStudentList(this.searchKey, this.page, this.limit,this.group_id).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allStudentList = res.data;
          this.total = res.pagination.total;
          this.form.clearAsyncValidators()
        } else {
          this.allStudentList = []
          this.total = 0;
        }
      }
    })
  }
  changeEvent(event: any, id: any) {
    let is_approved = 0;
    if (event.checked) {
      is_approved = 1;
    }
    this._adminService.StudentApprove(id, is_approved).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this._tosterService.success(res.message);
          this.getStudentList();
        } else {
          this._tosterService.warning(res.message);
        }
      },
      error: (error: any) => {
        if (error.status == 422) {
          this._tosterService.warning(error.message);
        } else {
          this._tosterService.error("Internal server error");
        }
      },
    })
  }
  changeAllEvent(event: any, id: any) {
    let is_approved = 0;
    if (event.checked) {
      is_approved = 1;
    }
    this._adminService.StudentAllApprove(id, is_approved).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this._tosterService.success(res.message);
          this.getStudentList();
        } else {
          this._tosterService.warning(res.message);
        }
      },
      error: (error: any) => {
        if (error.status == 422) {
          this._tosterService.warning(error.message);
        } else {
          this._tosterService.error("Internal server error");
        }
      },
    })
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getStudentList();

  }
    //download Student list
      downloadStudentList() {
        // this._adminService.downloadStudentList(this.searchKey).subscribe({
        //   next: (blob: Blob) => {
        //     const url = window.URL.createObjectURL(blob);
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.download = 'Student-List.xlsx';  // Set a proper filename
        //     link.click();
        //     window.URL.revokeObjectURL(url);
        //   },
        //   error: (err: any) => {
        //     if (err.error.status == 401 || err.error.status == 422) {
        //       this._tosterService.warning(err.error.message);
        //     } else {
        //       this._tosterService.warning('No Data Found');
        //     }
        //   }
        // })
      }
       //get all Group wma list
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
      this.filteredGroupList = this.allGroupList.filter(company =>
        company.group_name.toLowerCase().includes(this.searchGroupValue.toLowerCase())
      );
    } else {
      this.filteredGroupList = this.allGroupList;
    }
  }
}
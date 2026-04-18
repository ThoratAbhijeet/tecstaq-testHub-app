import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-result-report',
  templateUrl: './result-report.component.html',
  styleUrl: './result-report.component.scss'
})
export class ResultReportComponent implements OnInit {
  form!: FormGroup;
  allReportList: Array<any> = [];
  allGroupList: Array<any> = [];
  searchGroupValue: string = '';
  filteredGroupList: any[] = [];
  allTestList: Array<any> = [];
  searchTestValue: string = '';
  filteredTestList: any[] = [];
    allStudentList: Array<any> = [];
  searchStudentValue: string = '';
  filteredStudentList: any[] = [];
  page = 1;
  perPage = 50;
  total = 0;
  fromDate = '';
  toDate = '';
  test_id = '';
  group_id = '';
  student_id = '';
searchKey: any = '';
final_result = '';
  searchControl: FormControl = new FormControl('');
  constructor(private _adminService: AdminService, private fb: FormBuilder, private elRef: ElementRef, private _toastrService: ToastrService,) { }

  ngOnInit(): void {
    this.createForm();
    this.getAllGroupListWma();
     this.getAllStudentListWma('');
    this.searchControl.valueChanges.pipe(debounceTime(550)).subscribe((searchKey) => {
      this.getSearchInput(searchKey);
    });
  }
  createForm() {
    this.form = this.fb.group({
      fromDate: [''],  // No validation for unrestricted date selection
      toDate: [''],
      student_id:[''],
      final_result:['']
    });
  }
//  onGroupChange(event: any) {
//     const groupId = event.value;
//     this.group_id = groupId;
//     this.getAllTestListWma(this.group_id);
//   }
  //  onTestChange(event: any) {
  //   const testId = event.value;
  //   this.test_id = testId;
  //   this.getAllStudentListWma('');
  // }
  getAllStudentReportList() {
    this.fromDate = this.form.value.fromDate;
    this.toDate = this.form.value.toDate;
    // this.group_id = this.form.value.group_id;
    this.student_id = this.form.value.student_id;
    this.final_result = this.form.value.final_result;
    this._adminService.getAllTestResultById(this.page, this.perPage, this.fromDate, this.toDate,this.student_id, this.final_result,'', this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allReportList = res.data;
          this.total = res.pagination.total;
        } else {
          this.allReportList = [];
          this.total = 0;
        }
      }
    });
  }


  getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getAllStudentReportList();
  }



  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
    this.getAllStudentReportList();
  }


  //download All Student report list
  downloadAllStudentReportList() {
      this.fromDate = this.form.value.fromDate;
    this.toDate = this.form.value.toDate;
    this.student_id = this.form.value.student_id;
    this.final_result = this.form.value.final_result;
    this._adminService.downloadAllTestResultList(this.fromDate, this.toDate, this.student_id, this.final_result, '', this.searchKey).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'All-Student-Result-Report.xlsx';  // Set a proper filename
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => {
        if (err.error.status == 401 || err.error.status == 422) {
          this._toastrService.warning(err.error.message);
        } else {
          this._toastrService.warning('No Data Found');
        }
      }
    })
  }
  //get Group  list...
  getAllGroupListWma() {
    this._adminService.getAllGroupListWma().subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allGroupList = res.data;
          this.filteredGroupList = this.allGroupList

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
  getAllTestListWma(Id:any) {
    this._adminService.getAllTestListWma(Id).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allTestList = res.data;
          this.filteredTestList = this.allTestList

        }
      }
    });
  }
filterTest() {
  const value = this.searchTestValue?.toLowerCase().trim();

  if (value) {
    this.filteredTestList = this.allTestList.filter(item =>
      item.test_name.toLowerCase().includes(value)
    );
  } else {
    this.filteredTestList = [...this.allTestList];
  }
}
  getAllStudentListWma(Id:any) {
    this._adminService.getAllStudentsListWma(Id).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allStudentList = res.data;
          this.filteredStudentList = this.allStudentList

        }
      }
    });
  }
filterStudent() {
  const value = this.searchStudentValue?.toLowerCase().trim();

  if (value) {
    this.filteredStudentList = this.allStudentList.filter(item =>
      item.student_name.toLowerCase().includes(value)
    );
  } else {
    this.filteredStudentList = [...this.allStudentList];
  }
}
  
   allClearFilter() {
  this.form.markAsPristine();
  this.form.markAsUntouched();
  this.form.reset({
      fromDate: [''],  // No validation for unrestricted date selection
      toDate: [''],
      student_id:['']
    });
}
 
}

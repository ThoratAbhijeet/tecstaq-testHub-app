import { Component, ElementRef, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AdminService } from '../../admin.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrl: './test-report.component.scss'
})
export class TestReportComponent implements OnInit {
  form!: FormGroup;
  allReportList: Array<any> = [];
  allGroupList: Array<any> = [];
  searchGroupValue: string = '';
  filteredGroupList: any[] = [];
  page = 1;
  perPage = 50;
  total = 0;
  fromDate = '';
  toDate = '';
  test_id = '';
  group_id = '';
  Test_id = '';
searchKey: any = '';
  searchControl: FormControl = new FormControl('');
  constructor(private _adminService: AdminService, private fb: FormBuilder, private elRef: ElementRef, private _toastrService: ToastrService,) { }

  ngOnInit(): void {
    this.createForm();
    this.getAllGroupListWma();
    this.searchControl.valueChanges.pipe(debounceTime(550)).subscribe((searchKey) => {
      this.getSearchInput(searchKey);
    });
  }
  createForm() {
    this.form = this.fb.group({
      fromDate: [''],  // No validation for unrestricted date selection
      toDate: [''],
      group_id: [''],
    });
  }

  getAllTestReportList() {
    this.fromDate = this.form.value.fromDate;
    this.toDate = this.form.value.toDate;
    this.group_id = this.form.value.group_id;
    this._adminService.getAllTestReport(this.page, this.perPage, this.fromDate, this.toDate, this.group_id, this.searchKey).subscribe({
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
    this.getAllTestReportList();
  }



  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
    this.getAllTestReportList();
  }


  //download All Test report list
  downloadAllTestReportList() {
      this.fromDate = this.form.value.fromDate;
    this.toDate = this.form.value.toDate;
    this.group_id = this.form.value.group_id;
    this._adminService.downloadAllTestReportList(this.fromDate, this.toDate, this.group_id,this.searchKey).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'All-Test-Report.xlsx';  // Set a proper filename
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
 
  
   allClearFilter() {
  this.form.markAsPristine();
  this.form.markAsUntouched();
  this.form.reset({
      fromDate: [''],  // No validation for unrestricted date selection
      toDate: [''],
      group_id : [''],
    });
}
  formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}
}

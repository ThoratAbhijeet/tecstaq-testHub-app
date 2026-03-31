import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AdminService } from '../admin.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  allTestList: Array<any> = [];
  page = 1;
  limit = 50;
  total = 0;
  searchKey: any = '';
  searchControl: FormControl = new FormControl('');
  constructor(
    private _adminService: AdminService,
    private _tosterService: ToastrService,) {
  }

  ngOnInit(): void {
    this.getTestList();
       this.searchControl.valueChanges.pipe(debounceTime(550)).subscribe((searchKey) => {
          this.getSearchInput(searchKey);
        });
  }
     getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getTestList();
  }
  getTestList() {
    this._adminService.getTestList(this.searchKey, this.page, this.limit).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allTestList = res.data;
          this.total = res.pagination.total;
        } else {
          this.allTestList = []
          this.total = 0;
        }
      }
    })
  }
  changeEvent(event: any, id: any) {
    let status = 0;
    if (event.checked) {
      status = 1;
    }
    this._adminService.TestEnableDisable(id, status).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this._tosterService.success(res.message);
          this.getTestList();
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
    this.getTestList();

  }
    //download Test list
      downloadTestList() {
        // this._adminService.downloadTestList(this.searchKey).subscribe({
        //   next: (blob: Blob) => {
        //     const url = window.URL.createObjectURL(blob);
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.download = 'Test-List.xlsx';  // Set a proper filename
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
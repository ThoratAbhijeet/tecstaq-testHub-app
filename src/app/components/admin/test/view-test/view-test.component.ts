import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrl: './view-test.component.scss'
})
export class ViewTestComponent  implements OnInit {
  isEdit = false
  TestId: any;
  allTestDetails :any = {};
  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
     private location: Location,
     private _tosterService: ToastrService,

  ) { }
  ngOnInit(): void {
    //activate route get id
      this.TestId = this.url.snapshot.params['id'];
    if (this.TestId) {
      this.getTestById(this.TestId)
    }
  }
  //get Test by id
  getTestById(id: any) {
    this._adminService.getTestById(id).subscribe({
      next: (result: any) => {
        this.allTestDetails = result.data;
      }
    })
  }
   // cancel route location service
  goToback() {
    this.location.back();
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

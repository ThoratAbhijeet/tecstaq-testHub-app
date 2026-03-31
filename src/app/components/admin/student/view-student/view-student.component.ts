import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.scss'
})
export class ViewStudentComponent implements OnInit {
  isEdit = false
  StudentId: any;
  allStudentDetails :any = {};
  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
     private location: Location,
     private _tosterService: ToastrService,

  ) { }
  ngOnInit(): void {
    //activate route get id
      this.StudentId = this.url.snapshot.params['id'];
    if (this.StudentId) {
      this.getStudentById(this.StudentId)
    }
  }
  //get Student by id
  getStudentById(id: any) {
    this._adminService.getStudentById(id).subscribe({
      next: (result: any) => {
        this.allStudentDetails = result.data;
      }
    })
  }
   // cancel route location service
  goToback() {
    this.location.back();
  }
}

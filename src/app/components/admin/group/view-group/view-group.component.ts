import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrl: './view-group.component.scss'
})
export class ViewGroupComponent implements OnInit {
  isEdit = false
  GroupId: any;
  allGroupDetails :any = {};
  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
     private location: Location,
     private _tosterService: ToastrService,

  ) { }
  ngOnInit(): void {
    //activate route get id
      this.GroupId = this.url.snapshot.params['id'];
    if (this.GroupId) {
      this.getGroupById(this.GroupId)
    }
  }
  //get Group by id
  getGroupById(id: any) {
    this._adminService.getGroupById(id).subscribe({
      next: (result: any) => {
        this.allGroupDetails = result.data;
      }
    })
  }
   // cancel route location service
  goToback() {
    this.location.back();
  }
}

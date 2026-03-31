import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-quetion-type',
  templateUrl: './view-quetion-type.component.html',
  styleUrl: './view-quetion-type.component.scss'
})
export class ViewQuetionTypeComponent implements OnInit {
  isEdit = false
  QuetionTypeId: any;
  allQuetionTypeDetails :any = {};
  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
     private location: Location,
     private _tosterService: ToastrService,

  ) { }
  ngOnInit(): void {
    //activate route get id
      this.QuetionTypeId = this.url.snapshot.params['id'];
    if (this.QuetionTypeId) {
      this.getQuetionTypeById(this.QuetionTypeId)
    }
  }
  //get QuetionType by id
  getQuetionTypeById(id: any) {
    this._adminService.getQuetionTypeById(id).subscribe({
      next: (result: any) => {
        this.allQuetionTypeDetails = result.data;
      }
    })
  }
   // cancel route location service
  goToback() {
    this.location.back();
  }
}

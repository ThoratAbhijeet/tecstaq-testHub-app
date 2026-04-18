import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-questionnaire',
  templateUrl: './view-questionnaire.component.html',
  styleUrl: './view-questionnaire.component.scss'
})
export class ViewQuestionnaireComponent  implements OnInit {
  isEdit = false
  QuestionnaireId: any;
  allQuestionnaireDetails :any = {};
  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
     private location: Location,
     private _tosterService: ToastrService,

  ) { }
  ngOnInit(): void {
    //activate route get id
      this.QuestionnaireId = this.url.snapshot.params['id'];
    if (this.QuestionnaireId) {
      this.getQuestionnaireById(this.QuestionnaireId)
    }
  }
  //get Questionnaire by id
  getQuestionnaireById(id: any) {
    this._adminService.getQuestionnaireAdminById(id).subscribe({
      next: (result: any) => {
        this.allQuestionnaireDetails = result.data;
      }
    })
  }
   // cancel route location service
  goToback() {
    this.location.back();
  }
getOptionLabel(index: number): string {
  return String.fromCharCode(97 + index); // a, b, c, d
}
}

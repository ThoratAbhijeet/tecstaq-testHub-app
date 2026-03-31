import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminService } from '../../../admin.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-update-questionnaire',
  templateUrl: './add-update-questionnaire.component.html',
  styleUrl: './add-update-questionnaire.component.scss'
})
export class AddUpdateQuestionnaireComponent implements OnInit {
  isEdit = false
  form!: FormGroup;
  Questionnaire_id: any;
  selectedTabIndex = 0
  allCompanyList: Array<any> = [];
  searchCompanyValue: string = '';
  filteredCompanyList: any[] = [];
  previewUrl: string | ArrayBuffer | null = null;
  previewDocumentUrl: string | ArrayBuffer | null = null;
  user_id: any
  departments_id: any;

  constructor(
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private _sharedService: SharedService,
    private url: ActivatedRoute,
    private location: Location,
    private _adminService: AdminService,
  ) { }
  ngOnInit(): void {
    let user_id: any = localStorage.getItem('user_id')
    this.user_id = JSON.parse(user_id)
    this.createForm();
    this.Questionnaire_id = this.url.snapshot.params['id'];
    //activate route get Questionnaire id
    if (this.Questionnaire_id) {
      this.getQuestionnaireById(this.Questionnaire_id);
      this.isEdit = true
    }
    this.getAllCompanyListWma();
  }

  //Questionnaire form
 createForm() {
  this.form = this.fb.group({
    test_id: ['', Validators.required],
    questionnaireHeader: this.fb.array([this.newQuestionnaireHeader()])
  });
}
  get controls() {
    return this.form.controls
  }
  get getQuestionnaireArray(): FormArray {
    return this.form.get('questionnaireFooter') as FormArray
  }

 

newQuestionnaireHeader(): FormGroup {
  return this.fb.group({
    question: ['', Validators.required],
    question_type_id: ['', Validators.required],
    answer: [''],
    questionnaireFooter: this.fb.array([this.newQuestionnaireFooter()])
  });
}
  newQuestionnaireFooter(): FormGroup {
  return this.fb.group({
    option: ['', Validators.required]
  });
}
  get questionnaireHeaderArray(): FormArray {
  return this.form.get('questionnaireHeader') as FormArray;
}

getFooterArray(index: number): FormArray {
  return this.questionnaireHeaderArray.at(index).get('questionnaireFooter') as FormArray;
}
  removeQuestionnaire(i: number, Questionnaire_bank_documents_id: any) {
    if (!Questionnaire_bank_documents_id) {
      this.getQuestionnaireArray.removeAt(i);
      if (this.getQuestionnaireArray.length === 0) {
        // this.addQuestionnaire();
      }
    }
    if (this.isEdit && Questionnaire_bank_documents_id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this item!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
      }).then((result) => {

        if (result.isConfirmed) {
          // if (Questionnaire_bank_documents_id) {

          //   this._adminService
          //     .deleteQuestionnaireBankDocuments(Questionnaire_bank_documents_id)
          //     .subscribe({

          //       next: (res: any) => {

          //         if (res.status === 200) {
          //           this.getQuestionnaireArray.removeAt(i);

          //           if (this.getQuestionnaireArray.length === 0) {
          //             this.addBankDocument();
          //           }

          //           Swal.fire(
          //             'Deleted!',
          //             'Your item has been deleted.',
          //             'success'
          //           );

          //         } else {
          //           Swal.fire(
          //             'Error!',
          //             res.message || 'Delete failed',
          //             'error'
          //           );
          //         }
          //       },

          //       error: (err: any) => {
          //         Swal.fire(
          //           'Error!',
          //           err.error?.message || 'Something went wrong',
          //           'error'
          //         );
          //       }

          //     });

          // } else {
          //   this.getQuestionnaireArray.removeAt(i);
          //   if (this.getQuestionnaireArray.length === 0) {
          //     this.addBankDocument();
          //   }
          // }

        }

      });

    } else {
      this.getQuestionnaireArray.removeAt(i);

      if (this.getQuestionnaireArray.length === 0) {
        // this.addQuestionnaire();
      }
    }
  }
  //get all company wma list
  getAllCompanyListWma() {
    this._adminService.getAllQuetionTypeListWma().subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allCompanyList = res.data;
          this.filteredCompanyList = this.allCompanyList;
        }
      }
    });
  }
  filterCompany() {
    if (this.searchCompanyValue !== '') {
      this.filteredCompanyList = this.allCompanyList.filter(company =>
        company.name.toLowerCase().includes(this.searchCompanyValue.toLowerCase())
      );
    } else {
      this.filteredCompanyList = this.allCompanyList;
    }
  }


  onImagePreview(i: number) {
    const control = this.getQuestionnaireArray.at(i);
    const currentVisibility = control.get('visible')?.value;
    control.get('visible')?.setValue(!currentVisibility);
  }
 
  submit() {
    this.isEdit ? this.edit() : this.add();
  }
  //update
  edit() {
    let data = this.form.value;
    if (this.form.valid) {
      this._sharedService.setLoading(true);
      this._adminService.editQuestionnaire(this.Questionnaire_id, data).subscribe({
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
            this._toastrService.error(err.error.error)
          }

        }
      })
    } else {
      this.form.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //add
  add() {
    let data = this.form.value;
    // console.log(data);
    if (this.form.valid) {
      this._sharedService.setLoading(true);
      this._adminService.addQuestionnaire(data).subscribe({
        next: (res: any) => {
          if (res.success === true || res.status == 200) {
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
            this._toastrService.error(err.error.error)

          }

        }
      })
    } else {
      this.form.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  // cancel route location service
  goToback() {
    this.location.back();
  }
  //get Questionnaire by id
  getQuestionnaireById(id: any) {
    this._adminService.getQuestionnaireById(id).subscribe({
      next: (result: any) => {
        const data = result.data;
        this.controls['gender'].patchValue(data.gender)
        this.controls['father_name'].patchValue(data.father_name)
        this.controls['mother_name'].patchValue(data.mother_name)
        this.controls['blood_group'].patchValue(data.blood_group)
        this.controls['marital_status'].patchValue(data.marital_status)
        this.controls['personal_email'].patchValue(data.personal_email)
        // this.controls['country_code'].patchValue(data.country_code)
        this.controls['mobile_number'].patchValue(data.country_code + data.mobile_number)

        this.controls['profile_photo'].patchValue(data.profile_photo_base64)
        this.controls['current_address'].patchValue(data.current_address)
        this.controls['permanent_address'].patchValue(data.permanent_address)
        // this.controls['signed_in'].patchValue(data.signed_in)
        this.controls['alternate_contact_number'].patchValue(data.alternate_contact_number)
        this.controls['office_location'].patchValue(data.office_location)
        this.controls['work_location'].patchValue(data.work_location)
        this.controls['Questionnaire_status'].patchValue(data.Questionnaire_status)
        this.controls['holiday_calendar_id'].patchValue(data.holiday_calendar_id)
        this.controls['reporting_manager_id'].patchValue(data.reporting_manager_id)
        this.controls['uan_number'].patchValue(data.uan_number)
        this.controls['esic_number'].patchValue(data.esic_number)
        this.controls['pf_number'].patchValue(data.pf_number)
        this.controls['pan_card_number'].patchValue(data.pan_card_number)
        this.controls['aadhar_number'].patchValue(data.aadhar_number)
        this.controls['passport_no'].patchValue(data.passport_no)
        this.controls['payment_mode'].patchValue(data.payment_mode)
        this.controls['account_number'].patchValue(data.account_number)
        this.controls['bank_name'].patchValue(data.bank_name)
        this.controls['ifsc_code'].patchValue(data.ifsc_code)
        this.controls['branch_name'].patchValue(data.branch_name)
        this.controls['family_member_name'].patchValue(data.family_member_name)

        this.controls['last_drawn_salary'].patchValue(data.last_drawn_salary)
        this.controls['previous_designation'].patchValue(data.previous_designation)
        this.controls['hr_email'].patchValue(data.hr_email)
        this.controls['hr_mobile'].patchValue(data.hr_mobile)

        this.previewUrl = 'data:image/png;base64,' + data.profile_photo_base64;

        const QuestionnaireEducation = data.QuestionnaireEducation;
        if (QuestionnaireEducation.length > 0) {
          this.getQuestionnaireArray.clear();
          for (let index = 0; index < QuestionnaireEducation.length; index++) {
            const element = QuestionnaireEducation[index];
            // this.getQuestionnaireArray.push(this.newQuestionnaire());
            this.getQuestionnaireArray.at(index).get('Questionnaire_education_id')?.patchValue(element.Questionnaire_education_id)
            this.getQuestionnaireArray.at(index).get('education_type')?.patchValue(element.education_type)
            this.getQuestionnaireArray.at(index).get('education_name')?.patchValue(element.education_name)
            this.getQuestionnaireArray.at(index).get('passing_year')?.patchValue(element.passing_year)
            this.getQuestionnaireArray.at(index).get('university')?.patchValue(element.university)
            this.getQuestionnaireArray.at(index).get('university')?.patchValue(element.university)
            this.getQuestionnaireArray.at(index).get('document_name')?.patchValue(element.document_name)
            this.getQuestionnaireArray.at(index).get('file_path')?.patchValue(element.image_base64)
          }
        }
      
        
      
      
      }
    })
  }



 

}

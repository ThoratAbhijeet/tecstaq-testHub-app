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
  currentIndex  = 0
  allTestList: Array<any> = [];
  searchTestValue: string = '';
  filteredTestList: any[] = [];
  allQuestionTypeList: Array<any> = [];
  user_id: any
  isPreviewMode: boolean = false;
  jumpIndex: number | null = null;

 

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
    this.getAllTestListWma();
    this.getAllQuestionTypeListWma();
  }

nextQuestion() {
  const currentForm = this.questionnaireHeaderArray.at(this.currentIndex);

  if (currentForm.invalid) {
    currentForm.markAllAsTouched();
    return;
  }

  this.currentIndex++;
}

prevQuestion() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
  }
}
  //Questionnaire form
// ================= FORM CREATE =================
createForm() {
  this.form = this.fb.group({
    test_id: ['', Validators.required],
    questionnaireHeader: this.fb.array([this.newQuestionnaireHeader()])
  });
}

// ================= GETTERS =================
get controls() {
  return this.form.controls;
}

get questionnaireHeaderArray(): FormArray {
  return this.form.get('questionnaireHeader') as FormArray;
}

// Footer getter (Options)
getFooterArray(index: number): FormArray {
  return this.questionnaireHeaderArray.at(index).get('questionnaireFooter') as FormArray;
}

// ================= NEW FORM GROUP =================
newQuestionnaireHeader(): FormGroup {
  return this.fb.group({
    questionnaire_header_id: [''],
    question: ['', Validators.required],
    question_mark: ['', Validators.required],
    question_type_id: ['', Validators.required],
    answer: ['' , Validators.required],
    questionnaireFooter: this.fb.array([this.newQuestionnaireFooter()])
  });
}

newQuestionnaireFooter(): FormGroup {
  return this.fb.group({
    questionnaire_footer_id: [''],
    option: ['', Validators.required]
  });
}

// ================= ADD FUNCTIONS =================
addQuestion() {
  const currentForm = this.questionnaireHeaderArray.at(this.currentIndex);

  // ✅ validation check
  if (currentForm.invalid) {
    currentForm.markAllAsTouched();
    return;
  }

  // ✅ new question add
  this.questionnaireHeaderArray.push(this.newQuestionnaireHeader());

  // ✅ next question pe move
  this.currentIndex = this.questionnaireHeaderArray.length - 1;
}
addOption(questionIndex: number) {
  const footerArray = this.getFooterArray(questionIndex);

  if (footerArray.length < 4) {
    footerArray.push(this.newQuestionnaireFooter());
  } else {
    // optional: message dikha sakte ho
    alert('Maximum 4 options allowed');
  }
}

// ================= REMOVE FUNCTIONS =================

// Remove Question
removeQuestion(index: number, id?: any) {

  const total = this.questionnaireHeaderArray.length;

  // ✅ Only 1 question → just clear value
  if (total === 1) {
    this.questionnaireHeaderArray.at(0).reset();
    return;
  }

  // ✅ Without ID (new question)
  if (!id) {
    this.questionnaireHeaderArray.removeAt(index);

    // 👉 Handle index
    if (index === total - 1) {
      this.setCurrentQuestion(index - 1);
    } else {
      this.setCurrentQuestion(index);
    }

    return;
  }

  // ✅ With ID (Edit mode)
  if (this.isEdit && id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this item!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {

      if (result.isConfirmed) {

        // 👉 API CALL here

        this.questionnaireHeaderArray.removeAt(index);

        // 👉 Handle index
        if (index === total - 1) {
          this.setCurrentQuestion(index - 1);
        } else {
          this.setCurrentQuestion(index);
        }

        Swal.fire('Deleted!', 'Question deleted.', 'success');
      }
    });
  }
}
setCurrentQuestion(index: number) {
  this.currentIndex = index;

  setTimeout(() => {
    const el = document.getElementById('question-' + index);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}
// Remove Option
removeOption(questionIndex: number, optionIndex: number) {
  const footerArray = this.getFooterArray(questionIndex);

  footerArray.removeAt(optionIndex);

  if (footerArray.length === 0) {
    footerArray.push(this.newQuestionnaireFooter());
  }
}


  //get all test wma list
  getAllTestListWma() {
    this._adminService.getAllTestListWma('').subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allTestList = res.data;
          this.filteredTestList = this.allTestList;
        }
      }
    });
  }
  filterTest() {
    if (this.searchTestValue !== '') {
      this.filteredTestList = this.allTestList.filter(company =>
        company.test_name.toLowerCase().includes(this.searchTestValue.toLowerCase())
      );
    } else {
      this.filteredTestList = this.allTestList;
    }
  }
 
    //get question type  list...
  getAllQuestionTypeListWma() {
    this._adminService.getAllQuetionTypeListWma().subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allQuestionTypeList = res.data;
        }
      }
    });
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

      // ✅ Test ID
      this.controls['test_id'].patchValue(data.test_id);

      const headerData = data.questionnaireHeader || [];

      this.questionnaireHeaderArray.clear();
      if (headerData.length > 0) {
        headerData.forEach((questionItem: any) => {
          const questionGroup = this.newQuestionnaireHeader();
          questionGroup.patchValue({
            questionnaire_header_id : questionItem.questionnaire_header_id,
            question: questionItem.question,
            question_mark: questionItem.question_mark,
            question_type_id: questionItem.question_type_id,
            answer: questionItem.answer
          });

          // 👉 Handle Footer (Options)
          const footerArray = questionGroup.get('questionnaireFooter') as FormArray;
          footerArray.clear();

          const footerData = questionItem.questionnaireFooter || [];

          if (footerData.length > 0) {
            footerData.forEach((optionItem: any) => {
              const optionGroup = this.newQuestionnaireFooter();
              optionGroup.patchValue({
                questionnaire_footer_id: optionItem.questionnaire_footer_id,
                option: optionItem.option
              });

              footerArray.push(optionGroup);
            });
          } else {
            footerArray.push(this.newQuestionnaireFooter());
          }

          this.questionnaireHeaderArray.push(questionGroup);

        });

      } else {
        // fallback (at least 1 question)
        this.questionnaireHeaderArray.push(this.newQuestionnaireHeader());
      }
    }
  });
}


getAlphabetIndexSmall(index: number): string {
  return String.fromCharCode(97 + index); // 97 = 'a'
}
onQuestionTypeChange(index: number) {
  const question = this.questionnaireHeaderArray.at(index);
  const typeId = question.get('question_type_id')?.value;

  const footerArray = question.get('questionnaireFooter') as FormArray;

  // 👉 selected type find karo
  const selectedType = this.allQuestionTypeList.find(
    (x: any) => x.question_type_id == typeId
  );

  const typeName = selectedType?.question_type?.trim();

  // 👉 purane options remove karo
  while (footerArray.length > 0) {
    footerArray.removeAt(0);
  }

  let optionCount = 0;

  // 👉 Radio Button / Select → 2
  if (typeName === 'Radio Button' || typeName === 'Select') {
    optionCount = 2;
  }

  // 👉 Checkbox / Multiple Choice → 4
  else if (typeName === 'Checkbox' || typeName === 'Multiple Choice') {
    optionCount = 4;
  }

  // 👉 options create karo
  for (let i = 0; i < optionCount; i++) {
    footerArray.push(this.newQuestionnaireFooter());
  }
}
isMultiOptionType(question: any): boolean {
  const typeId = question.get('question_type_id')?.value;

  const selectedType = this.allQuestionTypeList.find(
    (x: any) => x.question_type_id == typeId
  );

  const typeName = selectedType?.question_type?.trim().toLowerCase();

  return (
    typeName === 'checkbox' ||
    typeName === 'multiple choice' ||
    typeName === 'radio button' ||
    typeName === 'select'
  );
}
getMaxOptions(question: any): number {
  const typeId = question.get('question_type_id')?.value;

  const selectedType = this.allQuestionTypeList.find(
    (x: any) => x.question_type_id == typeId
  );

  const typeName = selectedType?.question_type?.trim().toLowerCase();

  if (typeName === 'radio button' || typeName === 'select') {
    return 2;
  }

  if (typeName === 'checkbox' || typeName === 'multiple choice') {
    return 4;
  }

  return 0;
}
preview() {
  this.isPreviewMode = true;
}

backToEdit() {
  this.isPreviewMode = false;
}
goToQuestion() {
  if (!this.jumpIndex) return;

  const index = this.jumpIndex - 1; // because UI starts from 1

  if (index >= 0 && index < this.questionnaireHeaderArray.length) {
    this.currentIndex = index;
  } else {
    // alert('Invalid Question Number');  
    this._toastrService.warning('Invalid Question Number')
  }
}
}

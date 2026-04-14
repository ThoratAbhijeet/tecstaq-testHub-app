import { Component, HostListener, OnInit } from '@angular/core';
import { AdminService } from '../../../admin/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../../shared/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-update-student-test',
  templateUrl: './add-update-student-test.component.html',
  styleUrl: './add-update-student-test.component.scss'
})
export class AddUpdateStudentTestComponent implements OnInit {
  isEdit = false
  QuestionnaireId: any;
  QuestionForm!: FormGroup;
  allQuestionnaireDetails: any = {};
  allResultDetails: any = {};
  answeredQuestions: number[] = [];
  notAnsweredQuestions: number[] = [];
  selectedAnswers: any = {};
  remainingTime: string = '';
  timerInterval: any;
  student_name: any;
  student_id: any;
  test_id :any;
  currentQuestionIndex = 0;
  tabSwitched = false;
  isSubmitted = false;
  examStarted = false;

  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
    private location: Location,
    private _tosterService: ToastrService,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private router: Router

  ) { }
  ngOnInit(): void {
    const data = localStorage.getItem('user')
    this.student_name = data ? JSON.parse(data)?.user_name : null;
    this.student_id = data ? JSON.parse(data)?.student_id : null;
    //activate route get id
    this.QuestionnaireId = this.url.snapshot.params['id'];
    if (this.QuestionnaireId) {
      this.getQuestionnaireById(this.QuestionnaireId)
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.createForm();
    
  }
  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  createForm() {
    this.QuestionForm = this.fb.group({
      student_id: [this.student_id],
      test_id :[''],
      answer: this.fb.array([])
    });
  }

  get controls() {
    return this.QuestionForm.controls;
  }

  get answerArray(): FormArray {
    return this.QuestionForm.get('answer') as FormArray;
  }
  newQuestionnaireAnswers(): FormGroup {
    return this.fb.group({
      questionnaire_header_id: [''],
      questionnaire_footer_id: [0]
    });
  }
  initializeAnswers() {
    this.answerArray.clear();

    this.allQuestionnaireDetails?.questionnaireHeader.forEach((q: any) => {
      const group = this.newQuestionnaireAnswers();

      group.patchValue({
        questionnaire_header_id: q.questionnaire_header_id,
        questionnaire_footer_id: 0
      });

      this.answerArray.push(group);
    });
  }
  //get Questionnaire by id
  getQuestionnaireById(id: any) {
    this._adminService.getQuestionnaireById(id).subscribe({
      next: (result: any) => {
        this.allQuestionnaireDetails = result.data;
        this.test_id =  this.allQuestionnaireDetails.test_id;
        this.controls['test_id'].patchValue(this.test_id);
        this.initializeAnswers();
        this.startTimer();
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
  submit() {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit the test?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel',
      // ✅ ADD THIS
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    }).then((result) => {

      if (result.isConfirmed) {

        this.isSubmitted = true; // ✅ stop auto submit
        clearInterval(this.timerInterval); // ✅ stop timer

        let data = this.QuestionForm.value;

        if (this.QuestionForm.valid) {

          this._sharedService.setLoading(true);

          this._adminService.addQuestionnaireTestSubmit(data).subscribe({
            next: (res: any) => {

              if (res.success === true || res.status == 200) {

                Swal.fire({
                  icon: 'success',
                  title: 'Submitted!',
                  text: res.message,
                  timer: 2000,
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false
                });
                this.getTestResultById(this.student_id);
                localStorage.removeItem('examAnswers');
                localStorage.removeItem('examIndex');
                localStorage.removeItem('examEndTime');

              } else {
                this._tosterService.warning(res.message);
              }

              this._sharedService.setLoading(false);
            },

            error: (err: any) => {
              this._sharedService.setLoading(false);

              if (err.error.status == 422) {
                this._tosterService.warning(err.error.message);
              } else {
                this._tosterService.error(err.error.error);
              }
            }
          });

        } else {
          this.QuestionForm.markAllAsTouched();
          this._tosterService.warning('Fill required fields');
        }

      }

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
  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
  }
  nextQuestion() {

    // agar select nahi kiya
    if (!this.selectedAnswers[this.currentQuestionIndex]) {

      if (!this.notAnsweredQuestions.includes(this.currentQuestionIndex)) {
        this.notAnsweredQuestions.push(this.currentQuestionIndex);
      }

      this.answeredQuestions = this.answeredQuestions.filter(
        i => i !== this.currentQuestionIndex
      );
    }

    // next
    if (this.currentQuestionIndex < this.allQuestionnaireDetails.questionnaireHeader.length - 1) {
      this.currentQuestionIndex++;
    }
  }
  selectAnswer(index: number, option: any) {

    const currentQuestion =
      this.allQuestionnaireDetails.questionnaireHeader[index];

    this.answerArray.at(index).patchValue({
      questionnaire_header_id: currentQuestion.questionnaire_header_id,
      questionnaire_footer_id: option.questionnaire_footer_id
    });

    this.selectedAnswers[index] = option.questionnaire_footer_id;

    if (!this.answeredQuestions.includes(index)) {
      this.answeredQuestions.push(index);
    }

    this.notAnsweredQuestions = this.notAnsweredQuestions.filter(i => i !== index);

    // ✅ SAVE STATE
    localStorage.setItem('examAnswers', JSON.stringify(this.answerArray.value));
    localStorage.setItem('examIndex', this.currentQuestionIndex.toString());
  }
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  getEndDateTime(): number {
    const today = new Date();

    const [h, m, s] = this.allQuestionnaireDetails.end_time.split(':');

    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      +h,
      +m,
      +s
    );

    return end.getTime();
  }

  startTimer() {
    const endTime = this.getEndDateTime();
    this.examStarted = true;

    // ✅ Save endTime once
    localStorage.setItem('examEndTime', endTime.toString());

    this.timerInterval = setInterval(() => {

      const savedEnd = localStorage.getItem('examEndTime');
      const finalEndTime = savedEnd ? Number(savedEnd) : endTime;

      const now = new Date().getTime();
      const distance = finalEndTime - now;

      if (distance <= 0 && !this.isSubmitted) {
        this.isSubmitted = true;
        clearInterval(this.timerInterval);
        this.remainingTime = 'Time Up ⛔';
        this.autoSubmitTest();
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.remainingTime =
        `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;

    }, 1000);
  }
  autoSubmitTest() {
    Swal.fire({
      icon: 'warning',
      title: 'Time Up ⛔',
      text: 'Your test is being submitted automatically...',
      timer: 2000,
      showConfirmButton: false,
      // ✅ ADD THIS
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    let data = this.QuestionForm.value;

    this._sharedService.setLoading(true);

    this._adminService.addQuestionnaireTestSubmit(data).subscribe({
      next: (res: any) => {

        if (res.success === true || res.status == 200) {

          // ✅ RESULT BUTTON SWAL
          Swal.fire({
            icon: 'success',
            title: 'Submitted!',
            text: 'Your test has been submitted successfully.',
            showCancelButton: true,
            // ✅ ADD THIS
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,

            confirmButtonText: '<i class="bi bi-eye"></i> View Answers',
            cancelButtonText: '<i class="bi bi-box-arrow-right"></i> Exit',

            confirmButtonColor: '#198754', // green
            cancelButtonColor: '#dc3545'   // red
          })
            .then((result) => {

              // ✅ View Answers
              if (result.isConfirmed) {
                this.router.navigate([
                  '/student',
                  {
                    outlets: {
                      student_menu: ['test-result' ]
                    }
                  }
                ]);
                localStorage.removeItem('examAnswers');
                localStorage.removeItem('examIndex');
                localStorage.removeItem('examEndTime');
              }

              // ✅ Exit (Logout)
              else if (result.dismiss === Swal.DismissReason.cancel) {
                this.logout();
              }

            });

        } else {
          this._tosterService.warning(res.message);
        }

        this._sharedService.setLoading(false);
      },

      error: (err: any) => {
        this._sharedService.setLoading(false);

        if (err.error.status == 422) {
          this._tosterService.warning(err.error.message);
        } else {
          this._tosterService.error(err.error.error);
        }
      }
    });
  }
  isSelected(i: number, opt: any): boolean {
    return this.answerArray.at(i)?.value?.questionnaire_footer_id === opt.questionnaire_footer_id;
  }
  getTestResultById(id: any) {
    this._adminService.getTestResultById(id).subscribe({
      next: (result: any) => {

        const data = result.data[0];

        // ✅ Convert string to number (IMPORTANT FIX)
        const correct = Number(data.correct_marks);
        const total = Number(data.total_marks);

        // ✅ Safe percentage calculation
        const percentage = total > 0 ? (correct / total) * 100 : 0;

        Swal.fire({
          title: '<i class="bi bi-trophy-fill text-warning"></i> Test Result',
          width: '500px',
          background: '#f4f8ff',
          showClass: {
            popup: 'animate__animated animate__zoomIn'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOut'
          },
          html: `
          <div style="text-align:center; font-family:Arial">

            <h3 style="color:#0d6efd; margin-bottom:10px;">
              <i class="bi bi-file-earmark-text"></i> ${data.test_name}
            </h3>

            <p style="font-size:16px; margin-bottom:15px;">
              <i class="bi bi-person-circle"></i> <b>${data.student_name}</b>
            </p>

            <!-- Progress Bar -->
            <div style="margin-bottom:20px;">
              <div style="
                background:#e0e0e0;
                border-radius:20px;
                overflow:hidden;
                height:22px;
              ">
                <div style="
                  width:${percentage}%;
                  height:100%;
                  background:linear-gradient(90deg,#28a745,#20c997);
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:white;
                  font-size:12px;
                  font-weight:bold;
                  transition: width 1s ease-in-out;
                ">
                  ${correct} / ${total}
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div style="
              display:flex;
              justify-content:space-between;
              text-align:center;
              margin-top:15px;
            ">
              
              <div style="flex:1">
                <p style="margin:0; font-weight:bold;">
                  <i class="bi bi-bar-chart"></i><br>Attempted
                </p>
                <p>${data.attempted_questions}</p>
              </div>

              <div style="flex:1">
                <p style="margin:0; font-weight:bold; color:green;">
                  <i class="bi bi-check-circle-fill"></i><br>Correct
                </p>
                <p>${data.correct_questions}</p>
              </div>

              <div style="flex:1">
                <p style="margin:0; font-weight:bold; color:red;">
                  <i class="bi bi-x-circle-fill"></i><br>Wrong
                </p>
                <p>${data.wrong_questions}</p>
              </div>

            </div>

          </div>
        `,
          showCancelButton: true,
          // ✅ ADD THIS
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          confirmButtonText: '<i class="bi bi-eye"></i> View Answers',
          cancelButtonText: '<i class="bi bi-box-arrow-right"></i> Exit',

          confirmButtonColor: '#198754', // green
          cancelButtonColor: '#dc3545'   // red
        })
          .then((result) => {

            // ✅ View Answers
            if (result.isConfirmed) {
              this.router.navigate([
                  '/student',
                  {
                    outlets: {
                      student_menu: ['test-result']
                    }
                  }
                ]);
            }

            // ✅ Exit (Logout)
            else if (result.dismiss === Swal.DismissReason.cancel) {
              this.logout();
            }

          });
        this.allResultDetails = result.data;
      }
    });
  }
  logout() {
    localStorage.clear();
    this.router.navigate([''])

  }
  handleVisibilityChange = () => {

    // 👉 USER TAB SWITCH KAR GAYA
    if (this.examStarted && document.hidden && !this.isSubmitted) {
      this.tabSwitched = true;
    }

    // 👉 USER WAPAS AAYA
    if (this.examStarted && !document.hidden && this.tabSwitched && !this.isSubmitted) {

      // ⚠️ WARNING SHOW
      Swal.fire({
        icon: 'warning',
        title: 'Tab Switch Detected!',
        text: 'Your test will be submitted...',
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });

      // 🔒 prevent repeat
      this.isSubmitted = true;

      clearInterval(this.timerInterval);

      // 🔥 delay ke baad submit
      setTimeout(() => {
        this.autoSubmitTest();
      }, 1500);
    }
  }
  @HostListener('window:blur')
  onBlur() {
    if (this.examStarted && !this.isSubmitted) {
      this.tabSwitched = true;
    }
  }
  restoreState() {

    const savedAnswers = localStorage.getItem('examAnswers');
    const savedIndex = localStorage.getItem('examIndex');

    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers);

      parsed.forEach((ans: any, i: number) => {
        if (this.answerArray.at(i)) {
          this.answerArray.at(i).patchValue(ans);

          if (ans.questionnaire_footer_id !== 0) {
            this.selectedAnswers[i] = ans.questionnaire_footer_id;
            this.answeredQuestions.push(i);
          }
        }
      });
    }

    if (savedIndex) {
      this.currentQuestionIndex = Number(savedIndex);
    }
  }

}

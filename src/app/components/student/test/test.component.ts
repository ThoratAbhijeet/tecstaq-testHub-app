import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { AdminService } from '../../admin/admin.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  allQuestionnaireList: Array<any> = [];
  page = 1;
  limit = 50;
  total = 0;
  searchKey: any = '';
  searchControl: FormControl = new FormControl('');
  student_id: any;
  selectedTest: any;
userDetails: any;
  constructor(
    private _adminService: AdminService,
    private _tosterService: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    const data = localStorage.getItem('user')
  if (data) {
    this.userDetails = JSON.parse(data);
  }

    this.student_id = data ? JSON.parse(data)?.student_id : null;
    this.getQuestionnaireList();
    this.searchControl.valueChanges.pipe(debounceTime(550)).subscribe((searchKey) => {
      this.getSearchInput(searchKey);
    });
  }
  getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getQuestionnaireList();
  }
  getQuestionnaireList() {
    this._adminService
      .getStudentTestList(this.searchKey, this.page, this.limit, this.student_id)
      .subscribe({
        next: (res: any) => {
          if (res.data.length > 0) {
            this.allQuestionnaireList = res.data;
            this.total = res.pagination.total;
          } else {
            this.allQuestionnaireList = []
            this.total = 0;
          }

        }
      });
  }
  changeEvent(event: any, id: any) {
    let status = 0;
    if (event.checked) {
      status = 1;
    }
    this._adminService.QuestionnaireEnableDisable(id, status).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this._tosterService.success(res.message);
          this.getQuestionnaireList();
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
    this.getQuestionnaireList();

  }
  //download Questionnaire list
  downloadQuestionnaireList() {
    // this._adminService.downloadQuestionnaireList(this.searchKey).subscribe({
    //   next: (blob: Blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'Questionnaire-List.xlsx';  // Set a proper filename
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
openInstructionModal(item: any) {

  this.selectedTest = item;

  const now = new Date();

  // ✅ ALWAYS USE TODAY DATE
  const today = new Date();

  const [sh, sm, ss] = item.start_time.split(':').map(Number);
  const [eh, em, es] = item.end_time.split(':').map(Number);

  const startTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    sh, sm, ss
  );

  const endTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    eh, em, es
  );

  console.log('NOW:', now);
  console.log('START:', startTime);
  console.log('END:', endTime);

  // ❌ 1. Test Not Started
  if (now < startTime) {

    let timerInterval: any;

    Swal.fire({
      icon: 'warning',
      title: 'Test Not Started',
      html: `
        <p>This test is scheduled and not yet available.</p>
        <p><strong>Start Time:</strong> ${this.formatTime(item.start_time)}</p>
        <p>Starts in: <strong id="countdown"></strong></p>
      `,
      confirmButtonColor: '#f39c12',

      didOpen: () => {

        const countdownEl = document.getElementById('countdown');

        timerInterval = setInterval(() => {

          const nowTime = new Date().getTime();
          const diff = startTime.getTime() - nowTime;

          if (diff <= 0) {
            clearInterval(timerInterval);

            countdownEl!.innerHTML =
              '<span style="color:green;">Started ✅</span>';

            setTimeout(() => {
              Swal.close();
              this.showLiveSwal(item);
            }, 800);

            return;
          }

          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          let color = 'red';

          if (diff <= 300000 && diff > 60000) {
            color = 'orange';
          } else if (diff <= 60000) {
            color = 'green';
          }

          countdownEl!.innerHTML =
            `<span style="color:${color}; font-weight:bold;">
              ${String(hours).padStart(2, '0')}:
              ${String(minutes).padStart(2, '0')}:
              ${String(seconds).padStart(2, '0')}
            </span>`;

        }, 1000);
      },

      willClose: () => {
        clearInterval(timerInterval);
      }
    });

  }

  // ❌ 2. Test Expired
  else if (now > endTime) {

    Swal.fire({
      icon: 'error',
      title: 'Test Expired',
      html: `
        <p>This test is no longer available.</p>
        <p><strong>End Time:</strong> ${this.formatTime(item.end_time)}</p>
      `,
      confirmButtonColor: '#dc3545'
    });

  }

  // ✅ 3. Test Live
  else {
    this.showLiveSwal(item);
  }
}
showLiveSwal(item: any) {
  Swal.fire({
    title: 'Test Instructions',
    html: `
      <p><strong>Start Time:</strong> ${this.formatTime(item.start_time)}</p>
      <p><strong>Instructions:</strong></p>
      <ul style="text-align:left">
        <li>All questions are compulsory</li>
        <li>Do not refresh the page</li>
        <li>Each question has only one correct answer</li>
        <li>Time is limited, submit before it ends</li>
        <li><b>Do not switch tabs or minimize the window. If you do, your test will be automatically terminated.</b></li>
      </ul>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Start Test',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      this.startTest();
    }
  });
}
  startTest() {
    this.router.navigate([
      '/student',
      {
        outlets: {
          student_menu: 'attempt-test/' + this.selectedTest.questionnaire_id
        }
      }
    ]);
  }
    logout() {
      console.log("Logout clicked");
      
    localStorage.clear();
    this.router.navigate([''])

  }
}
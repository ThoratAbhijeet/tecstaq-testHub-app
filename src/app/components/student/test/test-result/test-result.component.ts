import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../admin/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.scss'
})
export class TestResultComponent implements OnInit {
  isEdit = false
  student_id: any;
  student_name: any;
  allTestResultDetails : Array<any> = [];
  openedIndex: number | null = null;
  constructor(
    private _adminService: AdminService,
    private url: ActivatedRoute,
     private _tosterService: ToastrService,
     private router:Router

  ) { }
  ngOnInit(): void {
 const data = localStorage.getItem('user')
    this.student_name = data ? JSON.parse(data)?.user_name : null;
    this.student_id = data ? JSON.parse(data)?.student_id : null;
    if (this.student_id) {
      this.getStudentTestResultList(this.student_id)
    }
     const wrongIndex = this.allTestResultDetails[0]?.answer
    .findIndex((q: { result_status: string; }) => q.result_status === 'wrong');

  this.openedIndex = wrongIndex !== -1 ? wrongIndex : null;
  }
  //get Test by id
  getStudentTestResultList(id: any) {
    this._adminService.getStudentTestResultList(id).subscribe({
      next: (result: any) => {
        this.allTestResultDetails = result.data;
      }
    })
  }
formatTime(time: string): string {
  if (!time) return '';

  const [h, m, s] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, s || 0);

  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

getDuration(start: string, end: string): string {
  if (!start || !end) return '';

  const [sh, sm, ss] = start.split(':').map(Number);
  const [eh, em, es] = end.split(':').map(Number);

  const sDate = new Date();
  sDate.setHours(sh, sm, ss || 0);

  const eDate = new Date();
  eDate.setHours(eh, em, es || 0);

  const diff = eDate.getTime() - sDate.getTime();

  const min = Math.floor(diff / 60000);
  const sec = Math.floor((diff % 60000) / 1000);

  return `${min}m ${sec}s`;
}
getScore() {
  return this.allTestResultDetails[0]?.answer
    ?.reduce((sum: any, q: { marks: any; }) => sum + q.marks, 0) || 0;
}

getPercentage() {
  const total = this.allTestResultDetails[0]?.total_marks || 0;
  const score = this.getScore();

  return total ? Math.round((score / total) * 100) : 0;
}

// 🔥 Scroll to question
scrollTo(index: number) {

  this.openedIndex = index;

  setTimeout(() => {

    const container = document.querySelector('.question-container');
    const element = document.getElementById('q' + index);

    if (container && element) {
      const top = element.offsetTop - 10; // thoda spacing

      container.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }

  }, 100);
}
toggle(index: number) {
  this.openedIndex = this.openedIndex === index ? null : index;
}
onExit() {
  localStorage.clear();
    this.router.navigate([''])

}
}

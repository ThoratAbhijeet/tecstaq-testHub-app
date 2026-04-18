import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AdminService } from '../admin.service';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
 GroupCount: any;
testCount: any;
StudentCount: any;
 allReportList: Array<any> = [];
 page = 1;
  perPage = 50;
  total = 0;
  activeTab: string = 'Pass'; 
  tabStatus :string = ''; 
  @ViewChild('ticketTabs') ticketTabs!: ElementRef;
  @ViewChildren('myChart') chartCanvases!: QueryList<ElementRef>;
  charts: Chart[] = [];
searchKey: any = '';
  constructor(
    private _adminService: AdminService,
    private elRef: ElementRef,
    private _toastrService: ToastrService
  ) {
    Chart.register(...registerables); // ✅ Register Chart.js modules
  }

  ngOnInit(): void {

    this.getAllGroupCount();
    this.getAllTestCount();
    this.getAllStudentCount();
     this.getAllStudentReportList();
  }
  

  getAllTestCount() {
    this._adminService.getAllTestCount().subscribe({
      next: (res: any) => {
        this.testCount = res.get_test_count;
      }
    });
  }
 

  getAllGroupCount() {
    this._adminService.getAllGroupCount().subscribe({
      next: (res: any) => {
        if (res) {
          this.GroupCount = res.get_group_count;
          
          
        }
      }
    });
  }
 getAllStudentCount() {
    this._adminService.getAllStudentCount()
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.StudentCount = res.get_student_count;
            console.log(this.StudentCount);
            
          }
        }
      });
  }
  destroyCharts() {
    this.charts.forEach(chart => chart?.destroy());
    this.charts = [];
  }

  createCharts() {
    // const labels = this.todayTaskStatusCount.map(item => item.date);
    // const openCounts = this.todayTaskStatusCount.map(item => item.open_count);
    // const closeCounts = this.todayTaskStatusCount.map(item => item.close_count);

    // this.chartCanvases.forEach(canvasRef => {
    //   const ctx = canvasRef.nativeElement.getContext('2d');
    //   if (!ctx) return;

    //   const chart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //       labels,
    //       datasets: [
    //         {
    //           label: 'Open',
    //           data: openCounts,
    //           backgroundColor: '#2196f3', // blue
    //           borderColor: '#1976d2',
    //           borderWidth: 1,
    //           hoverBackgroundColor: '#42a5f5'
    //         },
    //         {
    //           label: 'Closed',
    //           data: closeCounts,
    //           backgroundColor: '#f44336', // red
    //           borderColor: '#d32f2f',
    //           borderWidth: 1,
    //           hoverBackgroundColor: '#e57373'
    //         }
    //       ]

    //     },
    //     options: {
    //       responsive: true,
    //       maintainAspectRatio: false,
    //       plugins: {
    //         title: {
    //           display: true,
    //           text: 'Daily Ticket Status (Open vs Closed)',
    //           font: { size: 18, weight: 'bold' },
    //           color: '#333'
    //         },
    //         legend: {
    //           labels: {
    //             color: '#000',
    //             font: { size: 14 }
    //           }
    //         }
    //       }

    //     }
    //   });

    //   this.charts.push(chart);
    // });
  }
   getSearchInput(searchKey: any) {
    this.searchKey = searchKey;
    this.getAllStudentReportList();
  }

  getAllStudentReportList() {;
    this._adminService.getAllTestResultById(this.page, this.perPage,'','','',this.activeTab,this.tabStatus,this.searchKey).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allReportList = res.data;
          this.total = res.pagination.total;
        } else {
          this.allReportList = [];
          this.total = 0;
        }
      }
    });
  }
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.perPage = event.pageSize;
    this.getAllStudentReportList();
  }

isPassActive() {
  return this.activeTab === 'Pass';
}

isTabSwitchActive() {
  return this.tabStatus === 'Tab Switch Detected';
}

setTab(type: string) {
 if (type === 'Pass') {
    this.activeTab = 'Pass';
    this.tabStatus = '';
  } else if (type === 'Tab Switch Detected') {
    this.activeTab = '';
    this.tabStatus = 'Tab Switch Detected';
  }
  this.getAllStudentReportList();
}
}

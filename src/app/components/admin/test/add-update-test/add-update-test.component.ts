import { Location } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import { AdminService } from '../../admin.service';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { TempusDominus } from '@eonasdan/tempus-dominus';

@Component({
  selector: 'app-add-update-test',
  templateUrl: './add-update-test.component.html',
  styleUrl: './add-update-test.component.scss'
})
export class AddUpdateTestComponent implements OnInit, AfterViewInit {
  isEdit = false;
  TestForm!: FormGroup;
  Test_Id: any;
  allGroupList: Array<any> = [];
  searchGroupValue: string = '';
  filteredGroupList: any[] = [];
  pickerStart: any;
  pickerEnd: any;
  pickerTestDate: any;
  constructor(
    private fb: FormBuilder,
    private _toastrService: ToastrService,
    private _adminService: AdminService,
    private _sharedService: SharedService,
    private url: ActivatedRoute,
    private location: Location,
    private ngZone: NgZone
  ) { }
  ngOnInit(): void {
    this.createForm();
    this.Test_Id = this.url.snapshot.params['id'];
    this.getAllGroupListWma();
    //activate route get employee id
    if (this.Test_Id) {
      this.getTestById(this.Test_Id);
      this.isEdit = true
    }

  }
  ngAfterViewInit() {

    // ================= START TIME =================
    const startElement = document.getElementById('startTimePicker');
    if (startElement) {
      this.pickerStart = new TempusDominus(startElement, {
        display: {
          components: { calendar: false, hours: true, minutes: true, seconds: false },
          theme: 'light',
          placement: 'bottom'
        },
        localization: { format: 'hh:mm ', hourCycle: 'h12' },
      } as any);

      startElement.addEventListener('change.td', (e: any) => {
        const selectedDate = e.detail.date;
        if (selectedDate) {
          this.ngZone.run(() => {
            this.controls['start_time'].setValue(moment(selectedDate).format('HH:mm'));
          });
        }
      });
    }

    // ================= END TIME =================
    const endElement = document.getElementById('endTimePicker');
    if (endElement) {
      this.pickerEnd = new TempusDominus(endElement, {
        display: {
          components: { calendar: false, hours: true, minutes: true, seconds: false },
          theme: 'light',
          placement: 'bottom'
        },
        localization: { format: 'hh:mm ', hourCycle: 'h12' },
      } as any);

      endElement.addEventListener('change.td', (e: any) => {
        const selectedDate = e.detail.date;
        if (selectedDate) {
          this.ngZone.run(() => {
            this.controls['end_time'].setValue(moment(selectedDate).format('HH:mm'));
          });
        }
      });
    }

    // ================= TEST DATE (NEW) =================
    const testDateElement = document.getElementById('testdatePicker');
    if (testDateElement) {
      this.pickerTestDate = new TempusDominus(testDateElement, {
        display: {
          components: {
            calendar: true,
            date: true,
            month: true,
            year: true,
            hours: true,
            minutes: true,
            seconds: false
          },
          theme: 'light',
          placement: 'bottom'
        },
        localization: {
          locale: 'en-US',
          hourCycle: 'h12',
          format: 'dd/MM/yyyy',
        },
      } as any);

      testDateElement.addEventListener('change.td', (e: any) => {
        const selectedDate = e.detail.date;
        if (selectedDate) {
          this.ngZone.run(() => {
            this.controls['test_date'].setValue(
              moment(selectedDate).format('YYYY-MM-DD') // backend format
            );
          });
        }
      });
    }

  }
  //employee form
  createForm() {
    this.TestForm = this.fb.group({
      group_id: ['', Validators.required],
      test_name: ['', Validators.required],
      test_date: ['', Validators.required],
      duration: ['', Validators.required],
      total_marks: ['', Validators.required],
      cut_off: [''],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]

    })
  }
  get controls() {
    return this.TestForm.controls
  }

  submit() {
    this.isEdit ? this.editTest() : this.addTest()
  }

  //update Test
  editTest() {
    let data = this.TestForm.getRawValue();
    if (this.TestForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.editTest(this.Test_Id, data).subscribe({
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
            this._toastrService.error('Internal Server Error')
          }

        }
      })
    } else {
      this.TestForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //add Test
  addTest() {
    let data = this.TestForm.value;
    console.log(data);

    if (this.TestForm.valid) {
      this._sharedService.setLoading(true);
      this._adminService.addTest(data).subscribe({
        next: (res: any) => {
          if (res.status == 201 || res.status == 200) {
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
            this._toastrService.error('Internal Server Error')
          }
        }
      })
    } else {
      this.TestForm.markAllAsTouched()
      this._toastrService.warning('Fill required fields')
    }
  }
  //get employee by id
  getTestById(id: any) {
    this._adminService.getTestById(id).subscribe({
      next: (result: any) => {
        const TestData = result.data;

        // Patch main fields
        this.controls['group_id'].patchValue(TestData.group_id);
        this.controls['test_name'].patchValue(TestData.test_name);
        this.controls['test_date'].patchValue(
          moment.utc(TestData.test_date).local().format('DD/MM/YYYY')
        );
        this.controls['duration'].patchValue(TestData.duration);
        this.controls['total_marks'].patchValue(TestData.total_marks);
        this.controls['cut_off'].patchValue(TestData.cut_off)
        this.controls['start_time'].patchValue(
  moment(TestData.start_time, 'HH:mm:ss').format('HH:mm')
);

this.controls['end_time'].patchValue(
  moment(TestData.end_time, 'HH:mm:ss').format('HH:mm')
);
      }
    });
  }
  getAllGroupListWma() {
    this._adminService.getAllGroupListWma().subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.allGroupList = res.data;
          this.filteredGroupList = this.allGroupList;
        }
      }
    });
  }

  filterGroup() {
    if (this.searchGroupValue !== '') {
      this.filteredGroupList = this.allGroupList.filter(project =>
        project.group_name.toLowerCase().includes(this.searchGroupValue.toLowerCase())
      );
    } else {
      this.filteredGroupList = this.allGroupList;
    }
  }

  // cancel route location Group
  goToback() {
    this.location.back();
  }


}

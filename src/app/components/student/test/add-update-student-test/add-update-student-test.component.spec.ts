import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateStudentTestComponent } from './add-update-student-test.component';

describe('AddUpdateStudentTestComponent', () => {
  let component: AddUpdateStudentTestComponent;
  let fixture: ComponentFixture<AddUpdateStudentTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUpdateStudentTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateStudentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

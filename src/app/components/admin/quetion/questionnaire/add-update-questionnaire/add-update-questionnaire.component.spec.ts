import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateQuestionnaireComponent } from './add-update-questionnaire.component';

describe('AddUpdateQuestionnaireComponent', () => {
  let component: AddUpdateQuestionnaireComponent;
  let fixture: ComponentFixture<AddUpdateQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUpdateQuestionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateQuetionTypeComponent } from './add-update-quetion-type.component';

describe('AddUpdateQuetionTypeComponent', () => {
  let component: AddUpdateQuetionTypeComponent;
  let fixture: ComponentFixture<AddUpdateQuetionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUpdateQuetionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateQuetionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

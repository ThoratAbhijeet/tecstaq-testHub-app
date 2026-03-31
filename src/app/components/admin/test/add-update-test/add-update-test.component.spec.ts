import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTestComponent } from './add-update-test.component';

describe('AddUpdateTestComponent', () => {
  let component: AddUpdateTestComponent;
  let fixture: ComponentFixture<AddUpdateTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUpdateTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

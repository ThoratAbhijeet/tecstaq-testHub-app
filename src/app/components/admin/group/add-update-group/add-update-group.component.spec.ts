import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateGroupComponent } from './add-update-group.component';

describe('AddUpdateGroupComponent', () => {
  let component: AddUpdateGroupComponent;
  let fixture: ComponentFixture<AddUpdateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUpdateGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

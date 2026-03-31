import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuetionTypeComponent } from './view-quetion-type.component';

describe('ViewQuetionTypeComponent', () => {
  let component: ViewQuetionTypeComponent;
  let fixture: ComponentFixture<ViewQuetionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewQuetionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewQuetionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

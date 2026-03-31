import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuetionTypeComponent } from './quetion-type.component';

describe('QuetionTypeComponent', () => {
  let component: QuetionTypeComponent;
  let fixture: ComponentFixture<QuetionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuetionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuetionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

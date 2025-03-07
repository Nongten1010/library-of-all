import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterlibraryLoanComponent } from './interlibrary-loan.component';

describe('InterlibraryLoanComponent', () => {
  let component: InterlibraryLoanComponent;
  let fixture: ComponentFixture<InterlibraryLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterlibraryLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterlibraryLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

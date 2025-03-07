import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInterlibraryLoanComponent } from './admin-interlibrary-loan.component';

describe('AdminInterlibraryLoanComponent', () => {
  let component: AdminInterlibraryLoanComponent;
  let fixture: ComponentFixture<AdminInterlibraryLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInterlibraryLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInterlibraryLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

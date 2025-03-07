import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedModalComponent } from './returned-modal.component';

describe('ReturnedModalComponent', () => {
  let component: ReturnedModalComponent;
  let fixture: ComponentFixture<ReturnedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

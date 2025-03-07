import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasingResourcesComponent } from './purchasing-resources.component';

describe('PurchasingResourcesComponent', () => {
  let component: PurchasingResourcesComponent;
  let fixture: ComponentFixture<PurchasingResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasingResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasingResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLibraryOfThingsComponent } from './admin-library-of-things.component';

describe('AdminLibraryOfThingsComponent', () => {
  let component: AdminLibraryOfThingsComponent;
  let fixture: ComponentFixture<AdminLibraryOfThingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLibraryOfThingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLibraryOfThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

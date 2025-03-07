import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryOfThingeComponent } from './library-of-thinge.component';

describe('LibraryOfThingeComponent', () => {
  let component: LibraryOfThingeComponent;
  let fixture: ComponentFixture<LibraryOfThingeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryOfThingeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryOfThingeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

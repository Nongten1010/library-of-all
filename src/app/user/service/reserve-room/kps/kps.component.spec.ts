import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpsComponent } from './kps.component';

describe('KpsComponent', () => {
  let component: KpsComponent;
  let fixture: ComponentFixture<KpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

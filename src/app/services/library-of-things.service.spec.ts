import { TestBed } from '@angular/core/testing';

import { LibraryOfThingsService } from './library-of-things.service';

describe('LibraryOfThingsService', () => {
  let service: LibraryOfThingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryOfThingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CrudfirebaseService } from './crudfirebase.service';

describe('CrudfirebaseService', () => {
  let service: CrudfirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudfirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

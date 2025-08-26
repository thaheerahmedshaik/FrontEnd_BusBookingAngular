import { TestBed } from '@angular/core/testing';

import { BusesNamesService } from './buses-names.service';

describe('BusesNamesService', () => {
  let service: BusesNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusesNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

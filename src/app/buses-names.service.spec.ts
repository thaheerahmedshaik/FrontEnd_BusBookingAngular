import { TestBed } from '@angular/core/testing';
import { BusService } from './bus.service';   // ✅ correct file & class

describe('BusService', () => {
  let service: BusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return mock buses', (done: DoneFn) => {
    service.getBuses('A', 'B', '2025-09-13').subscribe(buses => {
      expect(buses.length).toBeGreaterThan(0);
      expect(buses[0].name).toContain('Travels');
      done();
    });
  });
});

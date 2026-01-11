import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceCaptureComponentComponent } from './face-capture-component.component';

describe('FaceCaptureComponentComponent', () => {
  let component: FaceCaptureComponentComponent;
  let fixture: ComponentFixture<FaceCaptureComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceCaptureComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceCaptureComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

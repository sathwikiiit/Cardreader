import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagecaptureComponent } from './imagecapture.component';

describe('ImagecaptureComponent', () => {
  let component: ImagecaptureComponent;
  let fixture: ComponentFixture<ImagecaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagecaptureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagecaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

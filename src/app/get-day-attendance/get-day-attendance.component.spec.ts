import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDayAttendanceComponent } from './get-day-attendance.component';

describe('GetDayAttendanceComponent', () => {
  let component: GetDayAttendanceComponent;
  let fixture: ComponentFixture<GetDayAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetDayAttendanceComponent]
    });
    fixture = TestBed.createComponent(GetDayAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

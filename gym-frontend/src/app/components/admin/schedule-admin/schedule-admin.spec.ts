import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAdminComponent } from './schedule-admin';

describe('ScheduleAdmin', () => {
  let component: ScheduleAdminComponent;
  let fixture: ComponentFixture<ScheduleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

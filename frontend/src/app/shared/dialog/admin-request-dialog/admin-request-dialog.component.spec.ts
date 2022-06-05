import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestDialogComponent } from './admin-request-dialog.component';

describe('AdminRequestDialogComponent', () => {
  let component: AdminRequestDialogComponent;
  let fixture: ComponentFixture<AdminRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

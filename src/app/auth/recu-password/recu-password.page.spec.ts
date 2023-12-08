import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuPasswordPage } from './recu-password.page';

describe('RecuPasswordPage', () => {
  let component: RecuPasswordPage;
  let fixture: ComponentFixture<RecuPasswordPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecuPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

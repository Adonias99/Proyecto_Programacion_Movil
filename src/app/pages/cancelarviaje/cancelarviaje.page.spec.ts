import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelarviajePage } from './cancelarviaje.page';

describe('CancelarviajePage', () => {
  let component: CancelarviajePage;
  let fixture: ComponentFixture<CancelarviajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarviajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

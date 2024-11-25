import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaViajePage } from './lista-viaje.page';

describe('ListaViajePage', () => {
  let component: ListaViajePage;
  let fixture: ComponentFixture<ListaViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

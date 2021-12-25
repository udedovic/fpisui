import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadnaListaComponent } from './radna-lista.component';

describe('RadnaListaComponent', () => {
  let component: RadnaListaComponent;
  let fixture: ComponentFixture<RadnaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadnaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadnaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

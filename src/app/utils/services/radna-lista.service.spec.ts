import { TestBed } from '@angular/core/testing';

import { RadnaListaService } from './radna-lista.service';

describe('RadnaListaService', () => {
  let service: RadnaListaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadnaListaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

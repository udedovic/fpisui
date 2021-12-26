import { TestBed } from '@angular/core/testing';

import { WorksheetService } from './worksheet.service';

describe('RadnaListaService', () => {
  let service: WorksheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorksheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OcorrenciaService } from './Ocorrencia.service';

describe('Service: Ocorrencia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OcorrenciaService]
    });
  });

  it('should ...', inject([OcorrenciaService], (service: OcorrenciaService) => {
    expect(service).toBeTruthy();
  }));
});

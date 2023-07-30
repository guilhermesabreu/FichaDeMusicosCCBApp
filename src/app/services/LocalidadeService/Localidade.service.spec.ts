/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LocalidadeService } from './Localidade.service';

describe('Service: Localidade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalidadeService]
    });
  });

  it('should ...', inject([LocalidadeService], (service: LocalidadeService) => {
    expect(service).toBeTruthy();
  }));
});

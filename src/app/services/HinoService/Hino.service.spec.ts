/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HinoService } from './Hino.service';

describe('Service: Hino', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HinoService]
    });
  });

  it('should ...', inject([HinoService], (service: HinoService) => {
    expect(service).toBeTruthy();
  }));
});

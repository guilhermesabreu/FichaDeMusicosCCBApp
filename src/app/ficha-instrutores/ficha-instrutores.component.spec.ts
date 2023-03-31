/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FichaInstrutoresComponent } from './ficha-instrutores.component';

describe('FichaInstrutoresComponent', () => {
  let component: FichaInstrutoresComponent;
  let fixture: ComponentFixture<FichaInstrutoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaInstrutoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaInstrutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

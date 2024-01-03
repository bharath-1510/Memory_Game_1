import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card12Component } from './card12.component';

describe('Card12Component', () => {
  let component: Card12Component;
  let fixture: ComponentFixture<Card12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Card12Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Card12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

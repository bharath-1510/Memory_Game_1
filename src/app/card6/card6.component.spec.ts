import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card6Component } from './card6.component';

describe('Card6Component', () => {
  let component: Card6Component;
  let fixture: ComponentFixture<Card6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Card6Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Card6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

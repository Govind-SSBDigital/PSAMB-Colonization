import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProperty } from './register-property';

describe('RegisterProperty', () => {
  let component: RegisterProperty;
  let fixture: ComponentFixture<RegisterProperty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterProperty],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterProperty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

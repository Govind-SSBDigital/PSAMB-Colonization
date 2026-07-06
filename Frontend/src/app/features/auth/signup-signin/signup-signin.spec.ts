import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSignin } from './signup-signin';

describe('SignupSignin', () => {
  let component: SignupSignin;
  let fixture: ComponentFixture<SignupSignin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupSignin],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupSignin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

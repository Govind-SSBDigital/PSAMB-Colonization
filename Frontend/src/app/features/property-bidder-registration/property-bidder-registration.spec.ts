import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBidderRegistration } from './property-bidder-registration';

describe('PropertyBidderRegistration', () => {
  let component: PropertyBidderRegistration;
  let fixture: ComponentFixture<PropertyBidderRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyBidderRegistration],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyBidderRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

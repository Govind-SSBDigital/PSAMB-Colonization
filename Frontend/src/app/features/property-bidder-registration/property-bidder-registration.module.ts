import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PropertyBidderRegistration } from './property-bidder-registration';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PropertyBidderRegistration],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    RouterModule.forChild([
      {
        path: '',
        component: PropertyBidderRegistration
      }
    ])
  ]
})
export class PropertyBidderRegistrationModule {}

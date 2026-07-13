import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import {PropertyVerification} from "./property-verification";


@NgModule({
  declarations: [PropertyVerification],
  imports: [
    CommonModule,
    SharedModule,

    RouterModule.forChild([
      {
        path: '',
        component: PropertyVerification
      }
    ])
  ]
})
export class PropertyVerificationModule {}

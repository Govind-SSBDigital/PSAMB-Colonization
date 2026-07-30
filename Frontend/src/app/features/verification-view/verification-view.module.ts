import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificationView } from './verification-view';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    VerificationView
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: VerificationView,
      }
    ])
  ]
})
export class VerificationViewModule {}
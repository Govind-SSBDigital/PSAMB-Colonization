import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificationView } from './verification-view';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    VerificationView
  ],
  imports: [
    RouterModule,
    ConfirmDialogModule,
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
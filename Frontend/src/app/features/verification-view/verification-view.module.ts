import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerificationView } from './verification-view';
@NgModule({
  declarations: [],
  imports: [
    RouterModule,

    RouterModule.forChild([
      {
        path: '',
        component: VerificationView,
      }
    ])
  ]
})
export class VerificationViewModule {}
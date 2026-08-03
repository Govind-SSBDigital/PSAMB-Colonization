import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Profile } from './profile';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [Profile],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    ToastrModule,
    RouterModule.forChild([
      {
        path: '',
        component: Profile
      }
    ])
  ]
})
export class ProfileModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Profile } from './profile';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [Profile],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    RouterModule.forChild([
          {
            path: '',
            component: Profile
          }
        ])
      ]
    })
    export class ProfileModule {}
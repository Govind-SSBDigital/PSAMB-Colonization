import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Profile } from './profile';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Profile],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
          {
            path: '',
            component: Profile
          }
        ])
      ]
    })
    export class ProfileModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Profile } from './profile';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
          {
            path: '',
            component: Profile
          }
        ])
      ]
    })
    export class ProfileModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RegisterProperty} from "./register-property";

@NgModule({
  declarations: [RegisterProperty],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    RouterModule.forChild([
      {
        path: '',
        component: RegisterProperty
      }
    ])
  ]
})
export class RegisterPropertyModule {}

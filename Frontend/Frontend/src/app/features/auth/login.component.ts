import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <mat-card class="p-6 max-w-sm w-full">
        <mat-card-title class="text-2xl font-bold">Sign In</mat-card-title>
        <mat-card-content class="mt-4">
          <p class="text-slate-400">Welcome! Secure login form placeholder.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: []
})
export class LoginComponent {}

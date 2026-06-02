import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="p-6 bg-slate-950 min-h-screen text-white">
      <h1 class="text-3xl font-bold tracking-tight">Colonization Management Hub</h1>
      <p class="mt-2 text-slate-400">Secure UAT control panel interface.</p>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}

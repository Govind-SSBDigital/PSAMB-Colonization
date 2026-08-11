import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  toggleSidebar() {
    // On small screens (bootstrap lg breakpoint = 992px) open a mobile overlay
    if (typeof window !== 'undefined' && window.innerWidth < 992) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
      return;
    }

    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }
}

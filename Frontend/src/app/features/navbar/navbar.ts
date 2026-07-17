import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMobileMenuOpen = false;
  isDownloadsDropdownOpen = false;

  @Output() messageSelected = new EventEmitter<string>();

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  clickMessages(event: Event) {
    event.preventDefault();
    this.closeMobileMenu();

    if (this.router.url === '/' || this.router.url.startsWith('/#') || this.router.url.includes('#messages-section')) {
      this.messageSelected.emit('all');
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.messageSelected.emit('all');
        }, 150);
      });
    }
  }

  toggleDownloadsDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDownloadsDropdownOpen = !this.isDownloadsDropdownOpen;
  }
}

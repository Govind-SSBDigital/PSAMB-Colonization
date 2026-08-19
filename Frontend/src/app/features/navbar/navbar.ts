import { Component, ElementRef,Output, HostListener,EventEmitter } from '@angular/core';
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
 isDownloadsOpen = false;
  isAboutUsOpen = false;
private readonly desktopBreakpoint = 1024;
  @Output() messageSelected = new EventEmitter<string>();

  constructor(private router: Router,private elRef: ElementRef) {}

toggleMobileMenu(): void {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
  this.setBodyScroll();
}

toggleDownloads(event: Event): void {
  event.preventDefault();
  event.stopPropagation(); // prevent the outside-click listener firing on this same click
  this.isDownloadsOpen = !this.isDownloadsOpen;
}
toggleAboutUs(event: Event): void {
  event.preventDefault();
  event.stopPropagation(); // prevent the outside-click listener firing on this same click
  this.isAboutUsOpen = !this.isAboutUsOpen;
}

closeMobileMenu(): void {
  this.isMobileMenuOpen = false;
  this.isDownloadsOpen = false;
  this.isAboutUsOpen = false;
  this.setBodyScroll();
}
private setBodyScroll(): void {
  document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
}
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  if (window.innerWidth <= this.desktopBreakpoint) {
    return;
  }

  if (!this.isDownloadsOpen && !this.isAboutUsOpen) {
    return;
  }

  const dropdowns = this.elRef.nativeElement.querySelectorAll('.nav-item.dropdown');
  let clickedInsideAnyDropdown = false;

  dropdowns.forEach((dropdown: HTMLElement) => {
    if (dropdown.contains(event.target as Node)) {
      clickedInsideAnyDropdown = true;
    }
  });

  if (!clickedInsideAnyDropdown) {
    this.isDownloadsOpen = false;
    this.isAboutUsOpen = false;
  }
}
@HostListener('window:resize')
onWindowResize(): void {
  if (window.innerWidth <= this.desktopBreakpoint && this.isDownloadsOpen) {
    return;
  }
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
    this.selectMessageTab('all');
  }

   selectMessageTab(tab: string) {
    const element = document.getElementById('messages-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

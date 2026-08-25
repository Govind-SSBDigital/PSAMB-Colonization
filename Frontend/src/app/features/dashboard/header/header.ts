import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IdleTimeoutService } from './../../../core/service/idle-timeout.service';
import { MenuService } from '../../../core/service/MenuService/menu.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();

  isUserMenuOpen = false;
  fullName: string = '';

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly router: Router,
    private idleTimeoutService: IdleTimeoutService,
    private menuService: MenuService
  ) {}

   ngOnInit(): void {
    this.menuService.profile$.subscribe(profile => {
      this.fullName = profile?.fullName || '';
    });
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logout() {
    this.idleTimeoutService.stop();
    sessionStorage.clear();
    this.closeUserMenu();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeUserMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeUserMenu();
  }
}

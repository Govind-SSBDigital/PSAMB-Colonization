import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MenuService, SubMenuItem } from '../../../core/service/MenuService/menu.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  standalone: true,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome implements OnInit {
  isLoggedIn = true;

  loggedInUser: {
    userId?: string;
    fullName?: string;
    userName?: string;
    entityType?: string;
  } = {};

  availableServices: SubMenuItem[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.fetchMenus(true).subscribe({
      next: (menus) => {
        this.availableServices = this.flattenServices(menus);
      },
      error: () => {
        this.availableServices = [];
      }
    });

    this.menuService.profile$.subscribe((profile) => {
      if (profile) {
        this.loggedInUser = {
          userId: profile.id ?? profile.userId ?? '',
          fullName: profile.fullName ?? profile.name ?? profile.userName ?? '',
          userName: profile.userName ?? '',
          entityType: profile.entityType ?? (Array.isArray(profile.roles) && profile.roles.length ? profile.roles.join(', ') : (typeof profile.roles === 'string' ? profile.roles : '')),
        };
      }
    });
  }

  private flattenServices(menus: any[]): SubMenuItem[] {
    return menus?.flatMap((menu) => (menu.subMenus ?? []).map((sub: SubMenuItem) => sub)) ?? [];
  }
}

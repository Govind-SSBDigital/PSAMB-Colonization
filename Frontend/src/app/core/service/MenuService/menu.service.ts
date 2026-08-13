import { Injectable } from '@angular/core';
import { Common } from '../CommonService/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError, shareReplay, map } from 'rxjs/operators';

export interface MenuItem {
  menuId: number;
  menuName: string;
  icon: string;
  sortOrder: number;
  subMenus: SubMenuItem[];
}

export interface SubMenuItem {
  subMenuId: number;
  subMenuName: string;
  route: string;
  icon: string;
  sortOrder: number;
}

export interface ProfileResponse {
  roles: string[];
  menus: MenuItem[];
  errors: any;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly storageKey = 'cp_menus';
  private menusSubject = new BehaviorSubject<MenuItem[]>([]);
  private profileSubject = new BehaviorSubject<any | null>(null);

  public menus$ = this.menusSubject.asObservable();
  public profile$ = this.profileSubject.asObservable();

  constructor(private common: Common) {
    this.loadFromStorage();
  }

  clearMenusCache(): void {
    sessionStorage.removeItem(this.storageKey);
    this.menusSubject.next([]);
    this.profileSubject.next(null);
  }

  private extractMenus(payload: any): MenuItem[] {
    const data = payload?.data ?? payload;
    const menus = data?.menus ?? payload?.menus ?? [];
    return Array.isArray(menus) ? menus : [];
  }

  private extractProfile(payload: any): any {
    const data = payload?.data ?? payload;
    return data?.profile ?? payload?.profile ?? null;
  }

  private loadFromStorage(): void {
    const cached = sessionStorage.getItem(this.storageKey);
    if (!cached) {
      return;
    }

    try {
      const parsed = JSON.parse(cached);
      const menus = this.extractMenus(parsed);
      const profile = this.extractProfile(parsed);
      this.menusSubject.next(menus);
      this.profileSubject.next(profile);
    } catch {
      sessionStorage.removeItem(this.storageKey);
      this.menusSubject.next([]);
      this.profileSubject.next(null);
    }
  }

  fetchMenus(forceRefresh = false): Observable<MenuItem[]> {
    if (!forceRefresh) {
      const cached = sessionStorage.getItem(this.storageKey);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          const menus = this.extractMenus(data);
          const profile = this.extractProfile(data);
          if (menus.length || profile) {
            this.menusSubject.next(menus);
            if (profile) {
              this.profileSubject.next(profile);
            }
            return of(menus);
          }
        } catch {
          sessionStorage.removeItem(this.storageKey);
        }
      }
    }

    return this.common.getMenuItemsByRole().pipe(
      tap((response: any) => {
        const menus = this.extractMenus(response);
        const profile = this.extractProfile(response);
        sessionStorage.setItem(this.storageKey, JSON.stringify({ menus, profile }));
        this.menusSubject.next(menus);
        this.profileSubject.next(profile);
      }),
      map((response: any) => this.extractMenus(response)),
      catchError(() => {
        this.menusSubject.next([]);
        this.profileSubject.next(null);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getMenus(): MenuItem[] {
    return this.menusSubject.value;
  }
}

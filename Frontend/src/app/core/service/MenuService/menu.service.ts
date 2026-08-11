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
  public menus$ = this.menusSubject.asObservable();

  constructor(private common: Common) {
    this.loadFromStorage();
  }

  clearMenusCache(): void {
    sessionStorage.removeItem(this.storageKey);
    this.menusSubject.next([]);
  }

  private extractMenus(payload: any): MenuItem[] {
    const data = payload?.data ?? payload;
    const menus = data?.menus ?? payload?.menus ?? [];
    return Array.isArray(menus) ? menus : [];
  }

  private loadFromStorage(): void {
    const cached = sessionStorage.getItem(this.storageKey);
    if (!cached) {
      return;
    }

    try {
      const menus = this.extractMenus(JSON.parse(cached));
      this.menusSubject.next(menus);
    } catch {
      sessionStorage.removeItem(this.storageKey);
      this.menusSubject.next([]);
    }
  }

  fetchMenus(forceRefresh = false): Observable<MenuItem[]> {
    if (!forceRefresh) {
      const cached = sessionStorage.getItem(this.storageKey);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          const menus = this.extractMenus(data);
          if (menus.length) {
            this.menusSubject.next(menus);
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
        sessionStorage.setItem(this.storageKey, JSON.stringify({ menus }));
        this.menusSubject.next(menus);
      }),
      map((response: any) => this.extractMenus(response)),
      catchError(() => {
        this.menusSubject.next([]);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getMenus(): MenuItem[] {
    return this.menusSubject.value;
  }
}

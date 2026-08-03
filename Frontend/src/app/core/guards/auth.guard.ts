import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (!token) {
      return this.router.createUrlTree(['/auth/login']);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;

      if (Date.now() > expiry) {

        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('cp_session');
        return this.router.createUrlTree(['/auth/login']);
      }

      return true;
    } catch {
      localStorage.clear();
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
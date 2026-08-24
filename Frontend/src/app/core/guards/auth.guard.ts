import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IdleTimeoutService } from '../service/idle-timeout.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private idleTimeoutService: IdleTimeoutService) {}

  canActivate(): boolean | UrlTree {
    const token = sessionStorage.getItem('token');

    if (!token) {
      return this.router.createUrlTree(['/auth/login']);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;

      if (Date.now() > expiry) {
        this.idleTimeoutService.stop();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('cp_session');
        return this.router.createUrlTree(['/auth/login']);
      }

      if (!this.idleTimeoutService.start()) {
        return this.router.createUrlTree(['/auth/login']);
      }

      return true;
    } catch {
      this.idleTimeoutService.stop();
      sessionStorage.clear();
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
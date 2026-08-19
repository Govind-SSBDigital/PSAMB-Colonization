import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CitizenServicesRedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;

        if (Date.now() <= expiry) {
          return this.router.createUrlTree(['/dashboard-citizen-services']);
        }
      } catch {
        return true;
      }
    }

    return true;
  }
}

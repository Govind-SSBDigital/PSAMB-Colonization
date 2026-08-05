import { Component, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Frontend');
  protected showNavbar = true;
  protected showFooter = true;

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.showNavbar = !url.startsWith('/dashboard');
        this.showFooter = !url.startsWith('/dashboard') &&
                          url !== '/auth/login' &&
                          url !== '/auth/register' &&
                          url !== '/new-login' &&
                          url !== '/new-signup' &&
                          url !== '/login';
      });

    const initialUrl = this.router.url;
    this.showNavbar = !initialUrl.startsWith('/dashboard');
    this.showFooter = !initialUrl.startsWith('/dashboard') &&
                      initialUrl !== '/auth/login' &&
                      initialUrl !== '/auth/register' &&
                      initialUrl !== '/new-login' &&
                      initialUrl !== '/new-signup' &&
                      initialUrl !== '/login';
  }
}

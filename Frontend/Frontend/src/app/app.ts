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

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !event.urlAfterRedirects.startsWith('/dashboard');
      });

    this.showNavbar = !this.router.url.startsWith('/dashboard');
  }
}

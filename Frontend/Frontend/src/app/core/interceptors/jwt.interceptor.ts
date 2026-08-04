import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly publicEndpoints = ['/auth/login', '/auth/signup', '/auth/register', '/auth/refresh'];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.shouldAttachToken(request)) {
      return next.handle(request);
    }

    const token = this.getToken();
    if (!token) {
      return next.handle(request);
    }

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authRequest);
  }

  private shouldAttachToken(request: HttpRequest<any>): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    if (request.headers.has('Authorization')) {
      return false;
    }

    const url = request.url.toLowerCase();
    return !this.publicEndpoints.some((endpoint) => url.includes(endpoint));
  }

  private getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      return sessionStorage.getItem('token');
    } catch {
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

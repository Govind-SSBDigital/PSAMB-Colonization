import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


export class AppHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly original: HttpErrorResponse,
  ) {
    super(message);
    this.name = 'AppHttpError';
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!this.isBrowser()) {
          return throwError(() => error);
        }
        if (error.status === 401 && !this.isAuthEndpoint(request.url)) {
          this.clearAuthSession();
          if (!this.router.url.startsWith('/auth/login')) {
            this.router.navigate(['/auth/login']);
          }
        }

        const message = this.resolveMessage(error);
        return throwError(() => new AppHttpError(message, error.status, error));
      }),
    );
  }

  private resolveMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Unable to reach the server. Check your internet connection.';
    }

    switch (error.status) {
      case 403:
        return this.extractBackendMessage(error) ?? "You don't have permission to do that.";
      case 404:
        return this.extractBackendMessage(error) ?? 'The requested resource was not found.';
      case 408:
        return 'The request timed out. Please try again.';
      case 409:
        return this.extractBackendMessage(error) ?? 'This conflicts with existing data.';
      case 422:
        return this.extractBackendMessage(error) ?? 'Some fields need your attention.';
      case 429: {
        const retryAfter = error.headers?.get?.('Retry-After');
        return retryAfter
          ? `Too many requests. Try again in ${retryAfter}s.`
          : 'Too many requests. Please slow down and try again.';
      }
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Something went wrong on our end. Please try again shortly.';
      default:
        return this.extractBackendMessage(error) ?? error.statusText ?? 'Something went wrong. Please try again.';
    }
  }

  private extractBackendMessage(error: HttpErrorResponse): string | null {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return null;
  }

  private isAuthEndpoint(url: string): boolean {
    const lower = url.toLowerCase();
    return ['/auth/login', '/auth/signup', '/auth/register', '/auth/refresh'].some((e) => lower.includes(e));
  }

  private clearAuthSession(): void {
    try {
      sessionStorage.removeItem('token');
    } catch {
      // Ignore storage access issues in non-browser contexts
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
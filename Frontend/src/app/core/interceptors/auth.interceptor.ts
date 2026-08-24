import { Injectable } from '@angular/core';
import {
    HttpRequest, HttpHandler, HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { IdleTimeoutService } from '../service/idle-timeout.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor(
        private authService: AuthService,
        private router: Router,
        private idleTimeoutService: IdleTimeoutService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = sessionStorage.getItem('token');
        if (token) {
            request = this.addToken(request, token);
        }

        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401 && !this.isAuthEndpoint(request.url)) {
                    return this.handle401Error(request, next);
                }
                return throwError(() => error);
            })
        );
    }

    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    private handle401Error(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = sessionStorage.getItem('refresh_token');
            if (!refreshToken) {
                this.idleTimeoutService.stop();
                this.authService.logout();
                this.router.navigate(['/auth/login']);
                return throwError(() => new Error('No refresh token'));
            }

            return this.authService.refreshToken().pipe(
                switchMap((response: any) => {
                    this.isRefreshing = false;
                    const newToken = response.data.token;
                    const newRefreshToken = response.data.refreshToken;

                    sessionStorage.setItem('token', newToken);
                    sessionStorage.setItem('refresh_token', newRefreshToken);

                    this.refreshTokenSubject.next(newToken);
                    return next.handle(this.addToken(request, newToken));
                }),
                catchError(err => {
                    this.isRefreshing = false;
                    this.idleTimeoutService.stop();
                    this.authService.logout();
                    this.router.navigate(['/auth/login']);
                    return throwError(() => err);
                })
            );
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => next.handle(this.addToken(request, token!)))
        );
    }

    private isAuthEndpoint(url: string): boolean {
        const lower = url.toLowerCase();
        return ['/auth/login', '/auth/signup', '/auth/register', '/auth/refresh', '/auth/refresh-token'].some((e) => lower.includes(e));
    }
}
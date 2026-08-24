import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private readonly IDLE_TIMEOUT_MS = 15 * 60 * 1000;
  private readonly STORAGE_KEY = 'cp_last_activity';
  private readonly ACTIVITY_EVENTS: Array<keyof DocumentEventMap> = [
    'click',
    'keydown',
    'touchstart',
    'scroll'
  ];
  private readonly CHECK_INTERVAL_MS = 30_000;
  private readonly WRITE_THROTTLE_MS = 5_000;

  private timer: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  private lastWriteTime = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private authService: AuthService,
    private router: Router
  ) {}

  start(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    if (this.isRunning) {
      this.recordActivity();
      return true;
    }

    if (this.isExpired()) {
      this.triggerLogout();
      return false;
    }

    this.bindEvents();
    this.startTimer();
    this.isRunning = true;
    this.recordActivity();
    return true;
  }

  stop(): void {
    this.unbindEvents();
    this.clearTimer();
    this.isRunning = false;
    this.lastWriteTime = 0;
    this.clearStoredActivity();
  }

  private isExpired(): boolean {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return false;
    }
    const lastActivity = parseInt(stored, 10);
    if (Number.isNaN(lastActivity)) {
      this.clearStoredActivity();
      return false;
    }
    return Date.now() - lastActivity >= this.IDLE_TIMEOUT_MS;
  }

  private recordActivity(): void {
    const now = Date.now();
    if (now - this.lastWriteTime < this.WRITE_THROTTLE_MS) {
      return;
    }
    this.lastWriteTime = now;
    sessionStorage.setItem(this.STORAGE_KEY, String(now));
  }

  private startTimer(): void {
    this.clearTimer();
    this.timer = setInterval(() => {
      if (this.isExpired()) {
        this.triggerLogout();
      }
    }, this.CHECK_INTERVAL_MS);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private onActivity = (): void => {
    if (this.isExpired()) {
      this.triggerLogout();
      return;
    }
    this.recordActivity();
  };

  private bindEvents(): void {
    this.unbindEvents();
    for (const event of this.ACTIVITY_EVENTS) {
      document.addEventListener(event, this.onActivity, { passive: true });
    }
  }

  private unbindEvents(): void {
    for (const event of this.ACTIVITY_EVENTS) {
      document.removeEventListener(event, this.onActivity);
    }
  }

  private triggerLogout(): void {
    this.stop();
    this.authService.logout();
    if (!this.router.url.startsWith('/auth/login')) {
      this.router.navigate(['/auth/login']);
    }
  }

  private clearStoredActivity(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}

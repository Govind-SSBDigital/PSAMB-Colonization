import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserState {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signals for synchronous UI state management
  private _currentUser = signal<UserState | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  // RxJS for asynchronous event-driven state stream
  private _notificationSubject = new BehaviorSubject<string | null>(null);
  readonly notifications$: Observable<string | null> = this._notificationSubject.asObservable();

  setCurrentUser(user: UserState | null): void {
    this._currentUser.set(user);
  }

  showNotification(message: string): void {
    this._notificationSubject.next(message);
    setTimeout(() => this._notificationSubject.next(null), 5000);
  }
}

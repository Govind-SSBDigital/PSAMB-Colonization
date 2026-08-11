import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) { }

  login(userId: string, password: string, isHRMSOrUser: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email: userId,
      password,
      isHRMSOrUser // 0 = user, 1 = officer
    });
  }

  register(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }
  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken })
        .subscribe({
          next: () => console.log('Logged out from server'),
          error: (err) => console.error('Logout error:', err)
        });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('cp_session');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      if (Date.now() > expiry) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  getSession(): any {
    const session = localStorage.getItem('cp_session');
    return session ? JSON.parse(session) : null;
  }
  sendLoginOtp(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-login-otp`, { mobileNumber });
  }

  loginWithOtp(mobileNumber: string, otp: string, isHRMSOrUser: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/login-with-otp`, { mobileNumber, otp, isHRMSOrUser });
  }
}
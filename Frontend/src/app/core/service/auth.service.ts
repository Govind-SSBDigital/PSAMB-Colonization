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

  login(userId: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email: userId,  // userId ko email ki jagah bhejo
      password
    });
  }

  register(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cp_session');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  sendLoginOtp(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-login-otp`, { mobileNumber });
  }

  loginWithOtp(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login-with-otp`, { mobileNumber, otp });
}
}
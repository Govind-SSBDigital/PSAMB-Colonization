import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Userservice {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  UserPropertyRegistration(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/UserPropertyRegistration/UserPropertyRegistration`, payload);
  }
}

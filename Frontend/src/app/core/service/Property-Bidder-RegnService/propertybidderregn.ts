import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Propertybidderregn  {
  baseUrl: string = environment.apiUrl;

constructor(private http: HttpClient) { }

registerProperty(payload: any): Observable<any> {
  debugger
  return this.http.post<any>(`${this.baseUrl}/PropertyBidderRegn/registerProperty`, payload);
}

getRegistrationById(id: any): Observable<any> {
  debugger
  return this.http.post<any>(`${this.baseUrl}/PropertyBidderRegn/getRegistrationById`, {params:{id}});
}

getAllPropertyRegistrations(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/PropertyBidderRegn/getAllPropertyRegistrations`);
}

getPropertyByCode(propertyCode: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/PropertyBidderRegn/search/${propertyCode}`);
}

UpdateRegisterPropertyAsync(payload: any): Observable<any> {
  debugger
  return this.http.put<any>(`${this.baseUrl}/PropertyBidderRegn/UpdateRegisterPropertyAsync`, payload);
}
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = `${environment.apiUrl}/Location`;

  // Cache
  private statesCache: any[] | null = null;
  private districtsCache: Map<number, any[]> = new Map();
  private citiesCache: Map<number, any[]> = new Map();

  constructor(private http: HttpClient) {}

  getStates(): Observable<any> {

    if (this.statesCache) {
      return of({ data: this.statesCache });
    }
    return this.http.get(`${this.apiUrl}/states`).pipe(
      tap((res: any) => {
        this.statesCache = res.data; // cache me store karo
      })
    );
  }

  getDistricts(stateId: number): Observable<any> {
    if (this.districtsCache.has(stateId)) {
      return of({ data: this.districtsCache.get(stateId) });
    }
    return this.http.get(`${this.apiUrl}/districts/${stateId}`).pipe(
      tap((res: any) => {
        this.districtsCache.set(stateId, res.data);
      })
    );
  }

  getCities(districtId: number): Observable<any> {
    if (this.citiesCache.has(districtId)) {
      return of({ data: this.citiesCache.get(districtId) });
    }
    return this.http.get(`${this.apiUrl}/cities/${districtId}`).pipe(
      tap((res: any) => {
        this.citiesCache.set(districtId, res.data);
      })
    );
  }
}
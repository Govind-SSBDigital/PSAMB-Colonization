import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Common {
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllStates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getAllStates`);
  }

  getAllDistrict(stateid: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getAllDistrict`, { params: { stateid } });
  }

  GetAllCityByDistrictID(districtid: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/GetAllCityByDistrictID`, { params: { districtid } });
  }

  getMarketCommittees(districtId: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getMarketCommittees`, { params: { districtId } });
  }

  getPlotTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getPlotTypes`);
  }

  getPlotSizes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getPlotSizes`);
  }

  getPlans(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getPlans`);
  }

  getPropertyTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getPropertyTypes`);
  }

  getBidderTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getBidderTypes`);
  }

  getApplicationStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getApplicationStatuses`);
  }

  getPropertyCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/getPropertyCategories`);
  }

  GetMandisByMarketCommiteeByDistrictAsync(branchID: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Common/GetMandisByMarketCommiteeByDistrictAsync`, { params: { branchID } });
  }

  getMenuItemsByRole(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Auth/profile`);
  }
}

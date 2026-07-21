import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { environment as prodEnvironment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Endpoints {
  constructor(private http: HttpClient) {}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public ServerUrl: string;
  public headers: any;
  public options: any;

  constructor(private http: HttpClient) {
    this.ServerUrl = 'http://localhost:80/SGVP-BackEnd/handler.php';
    this.headers = new Headers({ 'Content-Type': 'application/json' });
  }

  public get(additionalData: any): Observable<any> {
    this.options = { headers: this.headers, params: additionalData };
    return this.http.get(`${this.ServerUrl}`, this.options);
  }

  public set(additionalData: any): Observable<any> {
    additionalData = JSON.stringify(additionalData);
    this.options = { headers: this.headers };
    return this.http.post(`${this.ServerUrl}`, additionalData, this.options);
  }

  public update(additionalData: any): Observable<any> {
    additionalData = JSON.stringify(additionalData);
    this.options = { headers: this.headers };
    return this.http.put(`${this.ServerUrl}`, additionalData, this.options);
  }
}

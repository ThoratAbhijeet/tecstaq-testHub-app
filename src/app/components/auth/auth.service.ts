import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 //api
 url = environment.baseUrl;
 httpHeaders = new HttpHeaders({
   'Content-Type': 'application/json',
 });


  constructor(private http: HttpClient) { }
        //login
      login(data: any): Observable<any> {
        return this.http.post(this.url + 'api/user/login', data, {
          headers: this.httpHeaders,
        });
      }
  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  getToken() {
    let accessToken = localStorage.getItem('accessToken');
    if (accessToken != null) {
      return accessToken;
    }
    return null;
  }
}

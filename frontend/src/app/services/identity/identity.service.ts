import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private readonly STORAGE_KEY = 'ordo_display_name';
  private readonly TOKEN_KEY = 'kaiser_auth_token';
  
  private displayNameSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.STORAGE_KEY));
  displayName$ = this.displayNameSubject.asObservable();

  private apiUrl = 'http://10.0.110.7:8080/api/v1/auth';


  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        this.setIdentity(res.username, res.token, credentials.rememberMe);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  private setIdentity(name: string, token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem(this.STORAGE_KEY, name);
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.STORAGE_KEY, name);
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
    this.displayNameSubject.next(name);
  }

  getDisplayName(): string | null {
    return this.displayNameSubject.value || sessionStorage.getItem(this.STORAGE_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.displayNameSubject.next(null);
  }
}

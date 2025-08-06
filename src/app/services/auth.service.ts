
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://127.0.0.1:8000/api';

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register/`, userData);
  }

  login(userData: any) {
    return this.http.post(`${this.apiUrl}/login/`, userData);
  }

  setToken(token: string, username: string) {
    console.log('Setting token:', token);
    localStorage.setItem('access_token', token);
    localStorage.setItem('username', username);  // ✅ store username here
    this.loggedIn.next(true);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  hasToken() {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');  // ✅ clear username on logout
    this.loggedIn.next(false);
  }
}


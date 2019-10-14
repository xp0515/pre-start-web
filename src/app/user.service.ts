import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/';
  token: string;
  isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post(this.url + 'user/signup', authData);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post<{ token: string, message: string }>(this.url + 'user/login', authData);
  }

  getLoggedInUser() {
    const authInfo = this.getAuthData();
    if (authInfo) {
      this.token = authInfo;
      this.isAuthenticated = true;
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.clearAuthData();
    //this.router.navigate(['']);
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    this.isAuthenticated = true;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return token;
  }
}

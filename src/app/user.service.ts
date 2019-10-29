import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string;
  email: string;
  isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post(url + 'user/signup', authData);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post<{ token: string, email: string, message: string }>(url + 'user/login', authData);
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

  setToken(token: string, email: string) {
    this.token = token;
    this.email = email;
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    this.isAuthenticated = true;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return token;
  }
}

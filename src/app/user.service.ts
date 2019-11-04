import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData, Client } from './model';
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
  name: string;
  mobile: string;
  permission: number;
  client: string;

  isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) { }

  register(email: string, password: string) {
    const authData: AuthData = { email, password };
    return this.http.post(url + 'user/signup', authData);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    // tslint:disable-next-line: max-line-length
    return this.http.post<{ token: string, email: string, message: string, name: string, mobile: string, client: string }>(url + 'user/login', authData);
  }

  getLoggedInUser() {
    const authInfo = this.getAuthData();
    if (authInfo) {
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

  setToken(token) {
    this.token = token.token;
    this.email = token.email;
    this.name = token.name;
    this.mobile = token.mobile;
    this.permission = token.permission;
    this.client = token.client;
    localStorage.setItem('token', this.token);
    localStorage.setItem('email', this.email);
    localStorage.setItem('name', this.name);
    localStorage.setItem('mobile', this.mobile);
    localStorage.setItem('client', this.client);
    this.isAuthenticated = true;
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('mobile');
    localStorage.removeItem('client');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return token;
  }

  getClient(id) {
    return this.http.get<Client>(`${url}client/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { AuthData, Client } from './model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

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
  private authStatusListener = new Subject<boolean>();
  message = new BehaviorSubject<string>(null);

  private httpClient: HttpClient;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private handler: HttpBackend
  ) {
    this.httpClient = new HttpClient(handler);
  }

  register(user) {
    // const authData: AuthData = { email, password };
    return this.http.post(url + 'user/signup', user);
  }

  login(email: string, password: string) {
    // this.setCookies().subscribe(res => console.log(res));
    const authData: AuthData = { email, password };
    // tslint:disable-next-line: max-line-length
    this.http.post<{ token: string, email: string, message: string, name: string, mobile: string, permission: number, client: string }>(url + 'user/login', authData)
      .subscribe(res => {
        const token = {
          token: res.token,
          email: res.email,
          name: res.name,
          mobile: res.mobile,
          permission: res.permission,
          client: res.client
        };
        this.setToken(token);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['dashboard']);
        this.message.next(null);
      },
        err => {
          this.authStatusListener.next(false);
          this.message.next(err.error.message);
        });
  }

  getLoggedInUser() {
    const authInfo = this.getAuthData();
    if (authInfo) {
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      //this.router.navigate(['dashboard']);
    } else {
      return;
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['']);
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
    localStorage.setItem('permission', this.permission.toString());
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
    this.token = token;
    if (!token) {
      return;
    }
    return token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getMessage() {
    return this.message.asObservable();
  }

  getClient(id) {
    return this.http.get<Client>(`${url}client/${id}`);
  }

  getClients() {
    return this.http.get<Client[]>(`${url}clients`);
  }

  createClient(client) {
    return this.http.post<Client>(`${url}client`, client);
  }

  updateClient(client, clientId) {
    return this.http.put<Client>(`${url}client/${clientId}`, client);
  }

  getDrivers(clientId) {
    return this.http.get<any>(`${url}user/client/${clientId}`);
  }

  getAdmins() {
    return this.http.get<any>(`${url}user/admins`);
  }

  setCookies() {
    let body = new URLSearchParams()
    body.set('APIKEY', 'd12fa0fa7ceb45718c734c12945b953e');
    body.set('AccountName', 'Solbox');
    body.set('UserName', 'solboxdev');
    body.set('password', 'solbox@dev');

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    // console.log(body);
    return this.httpClient.post('https://login.solbox.it/API/Auth/login', body.toString(), options);
    this.cookieService.set('ASP.NET_SessionId', 'fn0fplvygbzalyihu3tcii4c');
    this.cookieService.set('.ASPXAUTH', 'auC3xPDsNZt85oJ-pVTOihNJihvOx-UB45WGvmlFoICFqqfPUFXuffa46nJV5cJiPrEeB9Uv4A-JnoA45uFsPYkNOemcl8GvHoVIgravSKAglK5W06iJxkBhIV_RfAZFvmg9se73OQwfi500OjRvmxzP4dAYCurO4kJYq9TqO-9mKE76zf52_LgjvMKluIiOnHilhjVwOUBQv-QzMN1t7dXKX0i199fhzGa_HduphPAUn9OtEex7Y4TyQPps0ujUpB19BarugitiLo3pYSnUJMcRsDSTpFYcQsjPwxwHSyiEfXlpHqnieN0_lKUErkIyKSnEFy1tJQpz0ydQzPCXKg');
  }
}

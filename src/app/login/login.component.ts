import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  errorMessage = '';
  isLoading = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
      this.isLoading = false;
    }
    this.isLoading = false;
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(4), Validators.required])
    });
    this.onChange();
  }

  onLogin() {
    this.userService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(res => {
        const token = {
          token: res.token,
          email: res.email,
          name: res.name,
          mobile: res.mobile,
          client: res.client
        };
        this.userService.setToken(token);
        this.router.navigate(['dashboard']);
      },
        err => {
          this.errorMessage = err.error.message;
        }
      );
  }

  onChange(): void {
    this.loginForm.valueChanges.subscribe(val => {
      this.errorMessage = '';
    });
  }

}

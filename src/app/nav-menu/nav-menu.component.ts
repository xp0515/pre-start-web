import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  client;
  name = localStorage.getItem('name');
  email = localStorage.getItem('email');
  display = false;
  clientName = '';
  admin = '';
  users = [

  ];
  mobileNotification = '';
  emailNotification = '';
  declaration = '';
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    const clientId = localStorage.getItem('client');
    this.userService.getClient(clientId).subscribe(client => this.client = client);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  showDialog() {
    this.display = true;
  }

  saveSettings() {

  }

  onLogOut() {
    this.userService.logout();
    //this.router.navigate(['']);
  }
}

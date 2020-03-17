import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-newClient',
  templateUrl: './newClient.component.html',
  styleUrls: ['./newClient.component.css']
})
export class NewClientComponent implements OnInit {
  public clientForm: FormGroup;
  userOptions: SelectItem[];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.clientForm = this.fb.group({
      name: new FormControl('', Validators.required),
      logo: new FormControl(''),
      admin: new FormControl(''),
      declaration: new FormControl(''),
    });
    this.userService.getAdmins().subscribe(admins => {
      this.userOptions = [];
      admins.forEach(admin => this.userOptions.push({
        label: `${admin.name} - ${admin.clientName}`,
        value: admin
      }));
    });
  }

  createClient() {
    this.userService.createClient(this.clientForm.value).subscribe(
      res => {
        alert('Client created successfully');
        this.clientForm.reset();
      },
      err => {
        alert('Client created failed');
      });
  }

}

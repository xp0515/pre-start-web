import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  clientOptions: SelectItem[];
  permissionOptions: SelectItem[];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(4), Validators.required]),
      name: new FormControl('', Validators.required),
      mobile: new FormControl(''),
      permission: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required)
    });
    this.userService.getClients().subscribe(clients => {
      this.clientOptions = [];
      clients.forEach(client => this.clientOptions.push({
        label: client.name,
        value: client
      }));
    });
    this.permissionOptions = [];
    this.permissionOptions.push({ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 });
  }

  signup() {
    this.userService.register(this.registerForm.value)
      .subscribe(res => {
        alert('Registered successfully');
        this.registerForm.reset();
      },
        err => {
          alert('Registration failed');
        });
  }
}

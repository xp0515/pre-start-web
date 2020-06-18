import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { UploadService } from '../upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  clientForm: FormGroup;
  client;
  name = localStorage.getItem('name');
  email = localStorage.getItem('email');
  display = false;
  fileUploadProgress: number = null;
  uploadedFiles: any[] = [];
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private uploadService: UploadService,
  ) {
    this.clientForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      mobile: new FormControl(''),
      email: new FormControl(''),
      declaration: new FormControl(''),
      logo: new FormControl('')
    });
  }

  ngOnInit() {
    const clientId = localStorage.getItem('client');
    this.userService.getClient(clientId).subscribe(client => {
      this.client = client;
      this.clientForm.patchValue({ name: client.name });
      this.clientForm.patchValue({ mobile: client.mobile });
      this.clientForm.patchValue({ email: client.email });
      this.clientForm.patchValue({ declaration: client.declaration });
    });

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

  editCompany() {
    this.userService.updateClient(this.clientForm.value, this.client._id).subscribe(() => {
      this.display = false;
    });
  }

  onLogOut() {
    this.userService.logout();
  }

  onFileSelect(event) {
    if (event.files.length > 0) {
      const file = event.files[0];
      this.clientForm.get('img').setValue(file);
      this.uploadedFiles.push(file);
    }
  }

  onUpload() {
    const formData = new FormData();
    const fileName = new Date().getTime() + this.clientForm.value.img.name;
    formData.append('file', this.uploadedFiles[0], fileName);
    this.uploadService.uploadFile(formData).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.fileUploadProgress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.fileUploadProgress}%`);
            break;
          case HttpEventType.Response:
            console.log('Image successfully uploaded!', event.body);
            this.clientForm.patchValue({ img: fileName });
            setTimeout(() => {
              this.fileUploadProgress = null;
            }, 1500);
        }
      },
      (err) => console.log(err)
    );
  }
}

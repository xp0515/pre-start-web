import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }

  uploadFile(formData) {
    return this.http.post<any>(url + 'files/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}

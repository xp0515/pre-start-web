import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  url = 'http://localhost:4000/';
  constructor(private http: HttpClient) { }

  // file from event.target.files[0]
  uploadFile(formData) {
    return this.http.post<any>(this.url + 'files/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getFile(fileName) {
    return this.http.get(`${this.url}file/${fileName}`);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inspection, Vehicle, Plan, Item, User } from './model';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';

const url = environment.apiUrl;
const clientId = localStorage.getItem('client');

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  items: Item[];
  plans: Plan[];
  selectedItemList = [];

  constructor(private http: HttpClient) { }

  getInspections() {
    return this.http.get<Inspection[]>(`${url}inspections/${clientId}`);
  }

  getInpection(id) {
    return this.http.get<Inspection>(`${url}inspections/${clientId}/${id}`);
  }

  updateInspection(id, inspection) {
    return this.http.put<Inspection>(`${url}inspections/${clientId}/${id}`, inspection);
  }

  deleteInspection(id) {
    return this.http.delete<Inspection>(`${url}inspections/${clientId}/${id}`);
  }

  getPlans() {
    return this.http.get<Plan[]>(`${url}plans/${clientId}`);
  }

  getPlan(id) {
    return this.http.get<Plan>(`${url}plans/${clientId}/${id}`);
  }

  createPlan(plan) {
    return this.http.post<Plan>(`${url}plan`, plan);
  }

  updatePlan(id, plan) {
    return this.http.put<Plan>(`${url}plans/${clientId}/${id}`, plan);
  }

  deletePlan(id) {
    return this.http.delete(`${url}plans/${clientId}/${id}`);
  }

  getVehicles() {
    return this.http.get<Vehicle[]>(`${url}vehicles/${clientId}`);
  }

  getItems() {
    return this.http.get<Item[]>(`${url}items/${clientId}`);
  }

  getItem(id) {
    return this.http.get<Item>(`${url}items/${clientId}/${id}`);
  }

  createItem(item) {
    return this.http.post<Item>(`${url}item`, item);
  }

  updateItem(id, item) {
    return this.http.put<Item>(`${url}items/${clientId}/${id}`, item);
  }

  deleteItem(id) {
    return this.http.delete<Item>(`${url}items/${clientId}/${id}`);
  }

  uploadFile(file) {
    return this.http.post(url + 'upload', file);
  }

}

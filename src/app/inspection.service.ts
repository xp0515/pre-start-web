import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inspection, Vehicle, Plan, Item, User } from './model';
import { environment } from '../environments/environment';

const url = environment.apiUrl;
//const clientId = localStorage.getItem('client');

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  items: Item[];
  plans: Plan[];
  selectedItemList = [];

  constructor(private http: HttpClient) { }

  getInspections(clientId) {
    return this.http.get<Inspection[]>(`${url}inspections/${clientId}`);
  }

  getInpection(clientId, id) {
    return this.http.get<Inspection>(`${url}inspections/${clientId}/${id}`);
  }

  updateInspection(clientId, id, inspection) {
    return this.http.put<Inspection>(`${url}inspections/${clientId}/${id}`, inspection);
  }

  deleteInspection(clientId, id) {
    return this.http.delete<Inspection>(`${url}inspections/${clientId}/${id}`);
  }

  getPlans(clientId) {
    return this.http.get<Plan[]>(`${url}plans/${clientId}`);
  }

  getPlan(clientId, id) {
    return this.http.get<Plan>(`${url}plans/${clientId}/${id}`);
  }

  createPlan(plan) {
    return this.http.post<Plan>(`${url}plan`, plan);
  }

  updatePlan(clientId, id, plan) {
    return this.http.put<Plan>(`${url}plans/${clientId}/${id}`, plan);
  }

  deletePlan(clientId, id) {
    return this.http.delete(`${url}plans/${clientId}/${id}`);
  }

  getVehicles(clientId) {
    return this.http.get<Vehicle[]>(`${url}vehicles/${clientId}`);
  }

  getItems(clientId) {
    return this.http.get<Item[]>(`${url}items/${clientId}`);
  }

  getItem(clientId, id) {
    return this.http.get<Item>(`${url}items/${clientId}/${id}`);
  }

  createItem(item) {
    return this.http.post<Item>(`${url}item`, item);
  }

  updateItem(clientId, id, item) {
    return this.http.put<Item>(`${url}items/${clientId}/${id}`, item);
  }

  deleteItem(clientId, id) {
    return this.http.delete<Item>(`${url}items/${clientId}/${id}`);
  }

  uploadFile(file) {
    return this.http.post(url + 'upload', file);
  }

}

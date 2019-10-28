import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inspection, Vehicle, Plan, Item, User } from './model';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  items: Item[];
  plans: Plan[];
  selectedItemList = [];

  url = 'http://localhost:4000/';

  constructor(private http: HttpClient) { }

  getInspections() {
    return this.http.get<Inspection[]>(this.url + 'inspections');
  }

  getInpection(id) {
    return this.http.get<Inspection>(this.url + 'inspections/' + id);
  }

  updateInspection(id, inspection) {
    return this.http.put<Inspection>(this.url + 'inspections/' + id, inspection);
  }

  deleteInspection(id) {
    return this.http.delete<Inspection>(this.url + 'inspections/' + id);
  }

  getPlans() {
    return this.http.get<Plan[]>(this.url + 'plans');
  }

  getPlan(id) {
    return this.http.get<Plan>(this.url + 'plans/' + id);
  }

  getVehicles() {
    return this.http.get<Vehicle[]>(this.url + 'vehicles');
  }

  getItems() {
    return this.http.get<Item[]>(this.url + 'items');
  }

  getItem(id) {
    return this.http.get<Item>(this.url + 'items/' + id);
  }

  createItem(item) {
    return this.http.post<Item>(this.url + 'item', item);
  }

  updateItem(id, item) {
    return this.http.put<Item>(this.url + 'items/' + id, item);
  }

  deleteItem(id) {
    return this.http.delete<Item>(this.url + 'items/' + id);
  }

  createPlan(plan) {
    return this.http.post<Plan>(this.url + 'plan', plan);
  }

  updatePlan(id, plan) {
    return this.http.put<Plan>(this.url + 'plans/' + id, plan);
  }

  deletePlan(id) {
    return this.http.delete(this.url + 'plans/' + id);
  }

  uploadFile(file) {
    return this.http.post(this.url + 'upload', file);
  }

}

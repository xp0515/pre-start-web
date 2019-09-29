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

  url = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getInspections() {
    return this.http.get<Inspection[]>(this.url + 'inspections');
  }
  //getPlans
  getPlans() {
    return this.http.get<Plan[]>(this.url + 'plans');
  }
  //getPlan
  getPlan(id) {
    return this.http.get<Plan>(this.url + 'plans/' + id);
  }
  //getVehicles
  getVehicles() {
    return this.http.get<Vehicle[]>(this.url + 'vehicles');
  }
  getInspection() {
    return;
  }
  //getItems
  getItems() {
    return this.http.get<Item[]>(this.url + 'items');
  }
  //getItem
  getItem(id) {
    return this.http.get<Item>(this.url + 'items/' + id);
  }
  //createItem
  createItem(item) {
    return this.http.post<Item>(this.url + 'item', item);
  }
  //updateItem
  updateItem(id, item) {
    return this.http.put<Item>(this.url + 'items/' + id, item);
  }
  //deleteItem
  deleteItem(id) {
    return this.http.delete<Item>(this.url + 'items/' + id);
  }
  //createPlan
  createPlan(plan) {
    return this.http.post<Plan>(this.url + 'plan', plan);
  }
  //updatePlan
  updatePlan(id, plan) {
    return this.http.put<Plan>(this.url + 'plans/' + id, plan);
  }
  //deletePlan
  deletePlan(id) {
    return this.http.delete(this.url + 'plans/' + id);
  }
  // getplans() {
  //   const promise = new Promise((resolve, reject) => {
  //     this.http.get<Plan[]>(this.url + 'plans').toPromise().then(res => {
  //       this.plans = res;
  //       resolve();
  //     }, msg => {
  //       reject();
  //     });
  //   });
  //   return promise;
  // }
  // getSelectedItemList(planId) {
  //   this.getplans().then(() => this.plans.forEach(ip => {
  //     if (ip.id.toString() === planId) {
  //       this.selectedItemList.push(ip.id.toString());
  //     }
  //   }));
  // }

  // refresh() {
  //   return this.http.get<Item[]>(this.url + 'Items')
  //     .toPromise().then(res => this.items = res as Item[]);
  // }
  // resetItemList() {
  //   this.selectedItemList = [];
  // }
}

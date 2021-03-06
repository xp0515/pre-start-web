import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inspection, Vehicle, Plan, Item, User, MassPlan } from './model';
import { environment } from '../environments/environment';

const url = environment.apiUrl;

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

  getMassPlans(clientId) {
    return this.http.get<MassPlan[]>(`${url}massPlans/${clientId}`);
  }

  getMassPlan(clientId, id) {
    return this.http.get<MassPlan>(`${url}massPlans/${clientId}/${id}`);
  }

  createMassPlan(massPlan) {
    return this.http.post<MassPlan>(`${url}massPlan`, massPlan);
  }

  updateMassPlan(clientId, id, massPlan) {
    return this.http.put<MassPlan>(`${url}massPlans/${clientId}/${id}`, massPlan);
  }

  deleteMassPlan(clientId, id, { }) {
    return this.http.put<MassPlan>(`${url}massPlans/${clientId}/disable/${id}`, {});
  }

  removeMassPlanFromPlan(clientId, id) {
    return this.http.delete<any>(`${url}plans/${clientId}/removeMassPlan/${id}`);
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

  getVehicle(clientId, id) {
    return this.http.get<Vehicle>(`${url}vehicles/${clientId}/${id}`);
  }

  updateVehicle(vehicle, id) {
    return this.http.put<Vehicle>(`${url}vehicles/${id}`, vehicle);
  }
  createVehicle(vehicle) {
    return this.http.post<Vehicle>(`${url}vehicle`, vehicle);
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

  deleteItem(clientId, id, item) {
    return this.http.put<Item>(`${url}items/${clientId}/disable/${id}`, item);
  }

  removeItemFromPlan(clientId, itemId) {
    return this.http.delete<any>(`${url}plans/${clientId}/removeitem/${itemId}`);
  }

  uploadFile(file) {
    return this.http.post(url + 'upload', file);
  }

  createVehicleGroup(clientId, vehicleGroup) {
    return this.http.post<any>(`${url}vehiclegroup/${clientId}`, vehicleGroup);
  }

  getVehicleGroup(clientId) {
    return this.http.get<any>(`${url}vehiclegroup/${clientId}`);
  }

  check() {
    //   return this.http.get('http://login.solbox.it/API/getcounts');
    return this.http.get('http://login.solbox.it/API/Orders/getOrder/82086');
    // const order = {
    //   id: -1,
    //   TypeId: 1,
    //   StatusId: 0,
    //   DeliveryClientID: 5918,
    //   dest_lat: -33.795647,
    //   dest_lng: 150.918869,
    //   dest_address: '',
    //   DeliveryTime: null,
    //   pickup_lat: -33.795647,
    //   pickup_lng: 150.918869,
    //   PickupClientID: 5193,
    //   PickupTime: null,
    //   PayerID: 5856,
    //   AddInfo: '',
    //   CustomerReference: '',
    //   OrderDetails: '',
    //   PickupServiceTime: 10,
    //   DeliveryServiceTime: 10,
    //   DeliveryTolerance: 60,
    //   PickupTolerance: 60,
    //   delivery_not_emails: '',
    //   delivery_not_sms: '',
    //   pickup_not_emails: '',
    //   pickup_not_sms: ''
    // }

    // return this.http.post('http://login.solbox.it/API/Orders/Saveorder', order);
  }

}

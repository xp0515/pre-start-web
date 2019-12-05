import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User, Client } from '../model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UploadService } from '../upload.service';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { UserService } from '../user.service';
import { ConfirmationService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.css']
})
export class NewPlanComponent implements OnInit {

  isLoading: Boolean = true;
  imageIsLoading: Boolean = true;
  timeDisabled = false;
  mileageDisabled = false;
  hourDisabled = false;
  planForm: FormGroup;
  itemForm: FormGroup;
  vehicleForm: FormGroup;
  clientId = localStorage.getItem('client');
  client: Client;
  items: Item[] = [];
  plans: Plan[] = [];
  item: Item;
  editDisplay = false;
  createItemDisplay = false;
  createVehicleDisplay = false;
  createVehicleGroupDisplay = false;
  mode = 'create';
  planId;
  plan: Plan;
  selectedItems = [];
  vehicles: Vehicle[] = [];
  selectedVehicles = [];
  selectedFrequency = '';
  timeOptions = [
    { label: '', value: '' },
    { label: 'Show all the time', value: 'Show all the time' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    //{ label: 'Custom period', value: 'Some value' },
  ];
  uploadedFiles: any[] = [];
  imgSrc: string = null;
  fileUploadProgress: number = null;
  tabIndex = 0;
  vehicleOptions: SelectItem[];
  data: TreeNode[] = [];
  selectedTreeVehicles: TreeNode[];
  sourceVehicleList: Vehicle[];
  targetVehicleList: Vehicle[];
  groupVehicleList = [];
  groupName = '';

  constructor(
    private fb: FormBuilder,
    public inspectionService: InspectionService,
    private messageService: MessageService,
    private userService: UserService,
    public route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService,
    public confirmationService: ConfirmationService,
  ) { }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  ngOnInit() {
    this.inspectionService.getItems(this.clientId).subscribe(res => this.items = res.filter(item => item.disabled !== true));
    this.inspectionService.getVehicles(this.clientId).subscribe(vehicles => {
      this.vehicles = vehicles;
      this.sourceVehicleList = vehicles;
      this.targetVehicleList = [];
      this.vehicleOptions = [];
      vehicles.forEach(vehicle => this.vehicleOptions.push({
        label: `${vehicle.rego} ${vehicle.make} ${vehicle.model}`,
        value: vehicle._id
      }));
    });
    this.userService.getClient(this.clientId).subscribe(client => {
      this.client = client;
    });
    this.inspectionService.getVehicleGroup(this.clientId).subscribe(res => {
      if (res) {
        this.data = res.group;
        // this.data.forEach(group => group.parent = null);
        console.log(this.data);
      }
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.planId = paramMap.get('id');
        this.inspectionService.getPlan(this.clientId, this.planId).subscribe(res => {
          this.plan = res;
          for (const item of this.plan.items) {
            this.selectedItems.push(item._id);
          }
          for (const vehicle of this.plan.vehicles) {
            this.selectedVehicles.push(vehicle._id);
            //this.selectedTreeVehicles.push(vehicle._id);
          }
          this.planForm.get('title').setValue(this.plan.title);
          this.planForm.get('frequency').get('type').setValue(this.plan.frequency.type);
          this.planForm.get('frequency').get('note').setValue(this.plan.frequency.note);
          const frequency = this.plan.frequency;
          if (frequency.type === 'by mileage') {
            this.selectedFrequency = 'by mileage';
            this.timeDisabled = true;
            this.hourDisabled = true;
          } else if (frequency.type === 'by engine hours') {
            this.timeDisabled = true;
            this.mileageDisabled = true;
            this.selectedFrequency = 'by engine hours';
          } else {
            this.mileageDisabled = true;
            this.hourDisabled = true;
            this.selectedFrequency = 'by time';
          }
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.planId = null;
        this.isLoading = false;
      }
    });
    this.planForm = this.fb.group({
      title: new FormControl('', Validators.required),
      items: new FormControl('', Validators.required),
      frequency: this.fb.group({
        type: new FormControl('', Validators.required),
        note: new FormControl('', Validators.required)
      }),
      vehicles: new FormControl(''),
      lastModified: new FormControl(Date.now()),
      client: new FormControl(''),
    });
    this.itemForm = this.fb.group({
      title: new FormControl('', Validators.required),
      instruction: new FormControl('', Validators.required),
      img: new FormControl(''),
      critical: new FormControl(''),
      client: new FormControl(''),
    });
    this.vehicleForm = this.fb.group({
      rego: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      make: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      model: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      client: new FormControl(''),
    });
  }

  showUpdatedItem(id) {
    this.imageIsLoading = true;
    this.imgSrc = null;
    this.uploadedFiles = [];
    this.inspectionService.getItem(this.clientId, id)
      .subscribe(res => {
        this.itemForm.reset();
        this.item = res;
        this.itemForm.get('title').setValue(this.item.title);
        this.itemForm.get('instruction').setValue(this.item.instruction);
        this.itemForm.get('critical').setValue(this.item.critical);
        this.itemForm.patchValue({ client: this.client });
        this.editDisplay = true;
        if (this.item.img) {
          this.imgSrc = `https://pre-start-api.azurewebsites.net/file/${this.item.img}`;
        }
      });
  }

  createItem() {
    this.uploadedFiles = [];
    this.itemForm.patchValue({ client: this.client });
    this.inspectionService.createItem(this.itemForm.value)
      .subscribe(res => {
        this.items.push(res);
        this.itemForm.reset();
        this.createItemDisplay = false;
      });
  }

  updateItem(id) {
    this.inspectionService.updateItem(this.clientId, id, this.itemForm.value).subscribe(res => {
      const index = this.items.findIndex(item => item._id === id);
      this.items[index] = res;
      this.editDisplay = false;
    });
  }

  deleteItem(id) {
    this.inspectionService.deleteItem(this.clientId, id, this.itemForm.value).subscribe(res => {
      this.items = this.items.filter(item => item._id !== id);
      this.removeItemFromPlan(this.clientId, id);
      this.uploadedFiles = [];
    });
  }

  removeItemFromPlan(clientId, itemId) {
    this.inspectionService.removeItemFromPlan(clientId, itemId).subscribe();
  }

  confirmDeleteItem(itemId) {
    this.confirmationService.confirm({
      message: 'Are you sure to delete this item? This may affect the saved inspection results.',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteItem(itemId);
      },
      reject: () => {
      }
    });
  }

  createVehicle() {
    this.vehicleForm.patchValue({ client: this.client });
    this.inspectionService.createVehicle(this.vehicleForm.value)
      .subscribe(res => {
        this.vehicles.push(res);
        this.vehicleForm.reset();
        this.createVehicleDisplay = false;
      });
  }

  createVehicleGroup() {
    this.data.push({
      label: this.groupName,
      children: this.groupVehicleList,
      parent: null
    });
    const vehicleGroup = {
      group: this.data,
      client: this.clientId
    };
    this.inspectionService.createVehicleGroup(this.clientId, vehicleGroup)
      .subscribe((res) => {
        this.createVehicleGroupDisplay = false;
        location.reload();
      });
  }

  createPlan() {
    this.isLoading = true;
    this.patchPlanFormValue();
    this.inspectionService.createPlan(this.planForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  updatePlan(id) {
    this.isLoading = true;
    this.patchPlanFormValue();
    this.inspectionService.updatePlan(this.clientId, id, this.planForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  patchPlanFormValue() {
    this.planForm.patchValue({ client: this.client });
    let vehicles = [];
    if (this.tabIndex === 0) {
      this.selectedVehicles.forEach(vehicle => {
        vehicles.push(vehicle);
      });
    } else {
      this.selectedTreeVehicles.forEach(vehicle => {
        if (vehicle.data) {
          vehicles.push(vehicle.data);
        }
      });
    }
    vehicles = [...new Set(vehicles)];
    this.planForm.patchValue({ vehicles: vehicles });
    console.log(this.planForm.value);
  }

  deletePlan(id) {
    this.isLoading = true;
    this.inspectionService.deletePlan(this.clientId, id).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  confirmDeletePlan(planId) {
    this.confirmationService.confirm({
      message: `Are you sure to delete this inspection plan? (This may affect the saved inspection results.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deletePlan(planId);
      },
      reject: () => {
      }
    });
  }

  showCreateItemDialog() {
    this.uploadedFiles = [];
    this.itemForm.reset();
    this.createItemDisplay = true;
  }

  showCreateVehicleDialog() {
    this.vehicleForm.reset();
    this.createVehicleDisplay = true;
  }

  showCreateVehicleGroupDialog() {
    this.inspectionService.getVehicles(this.clientId).subscribe(vehicles => this.sourceVehicleList = vehicles);
    this.targetVehicleList = [];
    this.groupName = '';
    this.createVehicleGroupDisplay = true;
  }

  updateFrequency() {
    if (this.selectedFrequency === 'by mileage') {
      this.planForm.get('frequency').setValue('Every ' + this.planForm.value.frequency + ' kms');
    } else if (this.selectedFrequency === 'by engine hours') {
      this.planForm.get('frequency').setValue('Every ' + this.planForm.value.frequency + ' hours');
    }
  }

  resetFrequency() {
    this.planForm.get('frequency').get('note').setValue('');
  }

  onFileSelect(event) {
    if (event.files.length > 0) {
      const file = event.files[0];
      this.itemForm.get('img').setValue(file);
      this.uploadedFiles.push(file);
    }
  }

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.itemForm.get('img').value);
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
            this.itemForm.get('img').setValue(event.body.file.filename);
            setTimeout(() => {
              this.fileUploadProgress = null;
            }, 1500);
        }
      },
      (err) => console.log(err)
    );
  }

  onTabChange(event) {
    this.tabIndex = event.index;
  }

  onNodeSelect(event) {
    console.log(this.selectedTreeVehicles);
  }

  onMoveToTarget(event) {
    event.items.forEach(item => {
      if (!this.groupVehicleList.some(vehicle => vehicle.data === item._id)) {
        this.groupVehicleList.push({
          label: `${item.rego} ${item.make} ${item.model}`,
          data: item._id
        });
      }
    });
  }

  onMoveToSource(event) {
    event.items.forEach(item => {
      this.groupVehicleList = this.groupVehicleList.filter(vehicle => vehicle.data !== item._id);
    });
  }

}

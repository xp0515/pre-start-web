import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User, Client, MassPlan } from '../model';
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
  massPlanForm: FormGroup;
  clientId = localStorage.getItem('client');
  client: Client;
  items: Item[] = [];
  plans: Plan[] = [];
  item: Item;
  massPlan: MassPlan;
  massPlans: MassPlan[];
  // weights: {
  //   title: string;
  //   value: number;
  //   unit: string;
  // }[] = [];
  editDisplay = false;
  createItemDisplay = false;
  createVehicleDisplay = false;
  editVehicleDisplay = false;
  createVehicleGroupDisplay = false;
  createMassPlanDisplay = false;
  editMassPlanDisplay = false;
  mode = 'create';
  planId;
  vehicleId;
  plan: Plan;
  selectedItems = [];
  vehicles: Vehicle[] = [];
  selectedVehicles = [];
  selectedMassPlan: MassPlan;
  selectedFrequency = '';
  selectedTime = '';
  selectedDay: number;
  timeOptions = [
    { label: '', value: '' },
    { label: 'Show all the time', value: 'Show all the time' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    //{ label: 'Custom period', value: 'Some value' },
  ];
  weeklyDayOptions = [
    { label: 'Monday', value: 1 },
    { label: 'Tueday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 7 },
  ];
  monthlyDayOptions = [];
  uploadedFiles: any[] = [];
  imgSrc: string = null;
  fileUploadProgress: number = null;
  tabIndex = 0;
  vehicleOptions: SelectItem[];
  clientOptions: SelectItem[];
  // massPlanOptions: SelectItem[];
  data: TreeNode[] = [];
  selectedTreeVehicles: TreeNode[];
  sourceVehicleList: Vehicle[];
  targetVehicleList: Vehicle[];
  groupVehicleList = [];
  groupName = '';
  permission = localStorage.getItem('permission');

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
        //console.log(this.data);
      }
    });
    this.userService.getClients().subscribe(clients => {
      this.clientOptions = [];
      clients.forEach(client => this.clientOptions.push({
        label: client.name,
        value: client
      }));
    });
    this.inspectionService.getMassPlans(this.clientId).subscribe(massPlans => {
      this.massPlans = massPlans.filter(massPlan => massPlan.disabled !== true);
      // this.massPlanOptions = [];
      // massPlans.forEach(massPlan => {
      //   this.massPlanOptions.push({
      //     label: massPlan.title,
      //     value: massPlan._id
      //   });
      // });
    });
    this.planForm = this.fb.group({
      title: new FormControl('', Validators.required),
      items: new FormControl('', Validators.required),
      frequency: this.fb.group({
        type: new FormControl('', Validators.required),
        note: new FormControl('', Validators.required),
        day: new FormControl('1')
      }),
      vehicles: new FormControl(''),
      massPlan: new FormControl('', Validators.required),
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
      make: new FormControl(''),
      model: new FormControl(''),
      maxLoad: new FormControl(''),
      client: new FormControl(''),
    });
    this.massPlanForm = this.fb.group({
      title: new FormControl('', Validators.required),
      weights: this.fb.array([
        // this.addWeightFormGroup()
      ]),
      client: new FormControl(''),
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
          }
          if (res.massPlan) {
            this.selectedMassPlan = res.massPlan;
          } else {
            this.selectedMassPlan = new MassPlan;
          }
          this.planForm.get('title').setValue(this.plan.title);
          this.planForm.get('frequency').get('type').setValue(this.plan.frequency.type);
          this.planForm.get('frequency').get('note').setValue(this.plan.frequency.note);
          this.planForm.get('frequency').get('day').setValue(this.plan.frequency.day);
          const frequency = this.plan.frequency;
          switch (frequency.type) {
            case 'by mileage':
              this.selectedFrequency = 'by mileage';
              this.timeDisabled = true;
              this.hourDisabled = true;
              break;
            case 'by engine hours':
              this.timeDisabled = true;
              this.mileageDisabled = true;
              this.selectedFrequency = 'by engine hours';
              break;
            default:
              this.mileageDisabled = true;
              this.hourDisabled = true;
              this.selectedFrequency = 'by time';
              this.selectedTime = frequency.note;
              this.selectedDay = frequency.day;
          }
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.planId = null;
        this.isLoading = false;
      }
    });
    // this.monthlyDayOptions.push({ label: '', value: '' });
    for (let i = 1; i < 29; i++) {
      this.monthlyDayOptions.push({
        label: i,
        value: i
      });
    }
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
          this.imgSrc = `https://prestartcheck.s3-ap-southeast-2.amazonaws.com/${this.item.img}`;
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
    this.inspectionService.createVehicle(this.vehicleForm.value)
      .subscribe(res => {
        this.vehicles.push(res);
        this.vehicleForm.reset();
        this.createVehicleDisplay = false;
      });
  }

  editVehicle() {
    this.inspectionService.updateVehicle(this.vehicleForm.value, this.vehicleId).subscribe(res => {
      this.editVehicleDisplay = false;
      this.vehicleForm.reset();
      this.vehicleId = null;
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

  addWeightFormGroup(): FormGroup {
    return this.fb.group({
      title: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
    });
  }

  addWeight() {
    (<FormArray>this.massPlanForm.get('weights')).push(this.addWeightFormGroup());
  }

  removeWeight(i) {
    (<FormArray>this.massPlanForm.get('weights')).removeAt(i);
  }

  createMassPlan() {
    this.massPlanForm.patchValue({ client: this.client });
    this.inspectionService.createMassPlan(this.massPlanForm.value).subscribe(res => {
      this.massPlans.push(res);
      this.createMassPlanDisplay = false;
    });
  }

  editMassPlan(id) {
    this.inspectionService.updateMassPlan(this.clientId, id, this.massPlanForm.value).subscribe(res => {
      const index = this.massPlans.findIndex(massPlan => massPlan._id === id);
      this.massPlans[index] = res;
      this.editMassPlanDisplay = false;
    });
  }

  deleteMassPlan(id) {
    this.inspectionService.deleteMassPlan(this.clientId, id, {}).subscribe(res => {
      this.massPlans = this.massPlans.filter(massPlan => massPlan._id !== id);
      this.removeMassPlanFromPlan(this.clientId, id);
    });
  }

  removeMassPlanFromPlan(clientId, id) {
    this.inspectionService.removeMassPlanFromPlan(clientId, id).subscribe();
  }

  showUpdatedMassPlan(id) {
    this.inspectionService.getMassPlan(this.clientId, id).subscribe(massPlan => {
      this.massPlan = massPlan;
      this.editMassPlanDisplay = true;
      this.massPlanForm.get('title').setValue(this.massPlan.title);
      this.massPlanForm.patchValue({ client: this.client });
      this.massPlanForm.setControl('weights', this.setExistingWeights(this.massPlan.weights));
    });
  }

  setExistingWeights(weights): FormArray {
    const formArray = new FormArray([]);
    weights.forEach(weight => {
      formArray.push(this.fb.group({
        title: weight.title,
        value: weight.value,
        unit: weight.unit
      }));
    });
    return formArray;
  }

  confirmDeleteMassPlan(id) {
    console.log('confirm delete mass');
    this.confirmationService.confirm({
      message: `Are you sure to delete this mass management plan?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteMassPlan(id);
      },
      reject: () => {
      }
    });
  }

  // resetRadioStatus(value) {
  //   console.log(this.selectedMassPlan)
  //   if (this.selectedMassPlan === value) {
  //     console.log(1)
  //     this.planForm.controls['massPlan'].reset();
  //   }
  // }

  createPlan() {
    this.isLoading = true;
    this.patchPlanFormValue();
    console.log(this.planForm.value);
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
    const note = this.planForm.get('frequency').value.note;
    if (note !== 'Weekly' && note !== 'Monthly') {
      this.planForm.patchValue({ frequency: { day: null } });
    }
  }

  deletePlan(id) {
    this.isLoading = true;
    this.inspectionService.deletePlan(this.clientId, id).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  confirmDeletePlan(planId) {
    this.confirmationService.confirm({
      message: `Are you sure to delete this inspection plan? (This may affect the saved inspection results.)`,
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

  showCreateMassPlanDialog() {
    this.massPlanForm.reset();
    this.createMassPlanDisplay = true;
  }

  showEditVehicleDialog(id) {
    this.inspectionService.getVehicle(this.clientId, id).subscribe(vehicle => {
      this.vehicleForm.get('rego').setValue(vehicle.rego);
      this.vehicleForm.get('make').setValue(vehicle.make);
      this.vehicleForm.get('model').setValue(vehicle.model);
      this.vehicleForm.get('maxLoad').setValue(vehicle.maxLoad);
      this.vehicleForm.get('client').setValue(vehicle.client.name);
      this.vehicleId = id;
      this.editVehicleDisplay = true;
    });
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
    const fileName = new Date().getTime() + this.itemForm.value.img.name;
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
            this.itemForm.patchValue({ img: fileName });
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
    //console.log(this.selectedTreeVehicles);
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

  onMassPlanClose() {
    this.massPlanForm.reset();
    (<FormArray>this.massPlanForm.get('weights')).clear();
    // this.addWeight();
  }

}

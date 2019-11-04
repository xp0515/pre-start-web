import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User, Client } from '../model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UploadService } from '../upload.service';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { UserService } from '../user.service';

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
  clientId = localStorage.getItem('client');
  client: Client;
  items: Item[] = [];
  plans: Plan[] = [];
  item: Item;
  editDisplay = false;
  createDisplay = false;
  itemForm: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    public inspectionService: InspectionService,
    private messageService: MessageService,
    private userService: UserService,
    public route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService
  ) { }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  ngOnInit() {
    this.inspectionService.getItems().subscribe(res => this.items = res);
    this.inspectionService.getVehicles().subscribe(res => this.vehicles = res);
    this.userService.getClient(this.clientId).subscribe(client => {
      this.client = client;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.planId = paramMap.get('id');
        this.inspectionService.getPlan(this.planId).subscribe(res => {
          this.plan = res;
          for (const item of this.plan.items) {
            this.selectedItems.push(item._id);
          }
          for (const vehicle of this.plan.vehicles) {
            this.selectedVehicles.push(vehicle._id);
          }
          this.planForm.get('title').setValue(this.plan.title);
          this.planForm.get('frequency').get('type').setValue(this.plan.frequency.type);
          this.planForm.get('frequency').get('note').setValue(this.plan.frequency.note);
          const frequency = this.plan.frequency;
          if (frequency.type === 'by mileage') {
            this.selectedFrequency = 'by mileage';
            this.timeDisabled = true;
            this.hourDisabled = true;
            //this.planForm.get('frequency').get('type').disable();
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
      client: new FormControl('')
    });
    this.itemForm = this.fb.group({
      title: new FormControl('', Validators.required),
      instruction: new FormControl('', Validators.required),
      img: new FormControl(''),
      client: new FormControl('')
    });
  }

  showUpdatedItem(id) {
    this.imageIsLoading = true;
    this.imgSrc = null;
    this.uploadedFiles = [];
    this.inspectionService.getItem(id)
      .subscribe(res => {
        this.itemForm.reset();
        this.item = res;
        this.itemForm.get('title').setValue(this.item.title);
        this.itemForm.get('instruction').setValue(this.item.instruction);
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
      .subscribe(() => {
        this.inspectionService.getItems().subscribe(res => this.items = res);
        this.itemForm.reset();
        this.createDisplay = false;
      });
  }

  updateItem(id) {
    this.inspectionService.updateItem(id, this.itemForm.value).subscribe(() => {
      this.inspectionService.getItems().subscribe(res => {
        this.items = res;
        this.editDisplay = false;
      });
    });
  }

  deleteItem(id) {
    this.inspectionService.deleteItem(id).subscribe(() => {
      this.inspectionService.getItems().subscribe(res => {
        this.items = res;
        this.uploadedFiles = [];
      });
    });
  }

  createPlan() {
    this.isLoading = true;
    this.planForm.patchValue({ client: this.client });
    this.inspectionService.createPlan(this.planForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  updatePlan(id) {
    this.isLoading = true;
    this.planForm.patchValue({ client: this.client });
    this.inspectionService.updatePlan(id, this.planForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  deletePlan(id) {
    this.isLoading = true;
    this.inspectionService.deletePlan(id).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  showCreateDialog() {
    this.uploadedFiles = [];
    this.itemForm.reset();
    this.createDisplay = true;
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
      //   if (event.type === HttpEventType.UploadProgress) {
      //     this.fileUploadProgress = Math.round(event.loaded / event.total * 100);
      //     console.log(event.loaded, event.total, this.fileUploadProgress);
      //   } else if (event.type === HttpEventType.Response) {
      //     this.fileUploadProgress = null;
      //     console.log(event.body);
      //     this.itemForm.get('img').setValue(event.body.file.id);
      //   }
      // },
      (err) => console.log(err)
    );
  }

}

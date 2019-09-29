import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User } from '../model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


@Component({
  selector: 'app-new-plan',
  templateUrl: './new-plan.component.html',
  styleUrls: ['./new-plan.component.css']
})
export class NewPlanComponent implements OnInit {

  planForm: FormGroup;
  items: Item[] = [];
  plans: Plan[] = [];
  item: Item;
  editDisplay = false;
  createDisplay = false;
  itemForm: FormGroup;
  createitemForm: FormGroup;
  mode = 'create';
  planId;
  plan: Plan;
  selectedItems = [];
  vehicles: Vehicle[] = [];
  selectedVehicles = [];

  constructor(private fb: FormBuilder,
    public inspectionService: InspectionService,
    private messageService: MessageService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }

  ngOnInit() {
    this.inspectionService.getItems().subscribe(res => this.items = res);
    this.inspectionService.getVehicles().subscribe(res => this.vehicles = res);
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
          this.planForm.get('frequency').setValue(this.plan.frequency);
        });
      } else {
        this.mode = 'create';
        this.planId = null;
      }
    });
    this.planForm = this.fb.group({
      title: new FormControl('', Validators.required),
      items: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
      vehicles: new FormControl(''),
      lastModified: new FormControl(Date.now())
    });
    this.itemForm = this.fb.group({
      title: new FormControl('', Validators.required),
      instruction: new FormControl('', Validators.required)
    });
  }

  showUpdatedItem(id) {
    this.inspectionService.getItem(id)
      .subscribe(res => {
        this.itemForm.reset();
        this.item = res;
        this.itemForm.get('title').setValue(this.item.title);
        this.itemForm.get('instruction').setValue(this.item.instruction);
        this.editDisplay = true;
      });
  }

  createItem() {
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
      });
      this.editDisplay = false;
    });
  }

  deleteItem(id) {
    this.inspectionService.deleteItem(id).subscribe(() => {
      this.inspectionService.getItems().subscribe(res => {
        this.items = res;
      });
    });
  }

  createPlan() {
    console.log(this.planForm.value);
    this.inspectionService.createPlan(this.planForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  updatePlan(id) {
    this.inspectionService.updatePlan(id, this.planForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  deletePlan(id) {
    this.inspectionService.deletePlan(id).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  showCreateDialog() {
    this.itemForm.reset();
    this.createDisplay = true;
  }

}

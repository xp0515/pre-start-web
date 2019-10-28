import { Component } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User } from '../model';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  inspectionCols = [
    { field: 'plan.title', header: 'Inspection plan', width: '167px' },
    { field: 'finalStatus', header: 'Status', width: '108px' },
    { field: 'vehicle.rego', header: 'Vehicle', width: '108px' },
    { field: 'startTime', header: 'Inspection date', width: '195px' },
    { field: 'odometer', header: 'Odometer', width: '129px' },
    { field: 'performedBy', header: 'Performed by', width: '150px' },
    { field: 'duration', header: 'Duration', width: '120px' },
  ];
  planCols = [
    { field: 'title', header: 'Inspection plan title' },
    { field: 'vehicle', header: 'Vehicles' },
    { field: 'frequency', header: 'Inspection frequency' },
    { field: 'lastModify', header: 'Last modified' },
    { field: 'edit', header: 'Edit' },
  ];
  inspections: Inspection[] = [];
  vehicles: Vehicle[];
  inspection: Inspection;
  plans: Plan[] = [];
  items: Item[] = [];
  delayedCount; failedCount; repairedCount; passCount; completedCount: number;
  planOptions; statusOptions; vehicleOptions; driverOptions: SelectItem[];
  odometerFilter; durationFilter: number;
  odometerTimeout; durationTimeout: any;
  isLoading = true;
  uploadedFiles: any[] = [];

  constructor(public inspectionService: InspectionService, public router: Router) { }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.inspectionService.getInspections().subscribe(inspections => {
      this.inspections = inspections;
      this.delayedCount = this.inspections.filter(i => i.finalStatus === 'Delayed').length;
      this.failedCount = this.inspections.filter(i => i.finalStatus === 'Fail').length;
      this.repairedCount = this.inspections.filter(i => i.finalStatus === 'Repaired').length;
      this.passCount = this.inspections.filter(i => i.finalStatus === 'Pass').length;
      this.completedCount = this.inspections.filter(i => i.finalStatus === 'Completed').length;
      this.inspectionService.getPlans().subscribe(plans => {
        this.plans = plans;
        this.inspectionService.getItems().subscribe(items => {
          this.items = items;
          this.isLoading = false;
        });
      });
    });

    this.statusOptions = [
      { label: 'Pass', value: 'Pass' },
      { label: 'Fail', value: 'Fail' },
      { label: 'Repaired', value: 'Repaired' },
      { label: 'Delayed', value: 'Delayed' },
    ];

    this.inspectionService.getPlans().subscribe(plans => {
      this.planOptions = [];
      plans.forEach(plan => this.planOptions.push({ label: plan.title, value: plan.title }));
    });

    this.inspectionService.getVehicles().subscribe(vehicles => {
      this.vehicleOptions = [];
      vehicles.forEach(vehicle => this.vehicleOptions.push({ label: vehicle.rego, value: vehicle.rego }));
    });

  }

  getFailCount(inspection) {
    return inspection.result.filter(r => r.result === 'Fail').length;
  }

  viewInspection(id) {
    this.inspectionService.getInpection(id).subscribe(() => this.router.navigate([`inspections/${id}`]));
  }

  onOdometerChange(event, dt) {
    if (this.odometerTimeout) {
      clearTimeout(this.odometerTimeout);
    }

    this.odometerTimeout = setTimeout(() => {
      dt.filter(event.value, 'odometer', 'gt');
    }, 250);
  }

  onDurationChange(event, dt) {
    if (this.durationTimeout) {
      clearTimeout(this.durationTimeout);
    }

    this.durationTimeout = setTimeout(() => {
      dt.filter(event.value, 'duration', 'gt');
    }, 250);
  }

}



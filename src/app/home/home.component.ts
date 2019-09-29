import { Component } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User } from '../model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  inspectionModalDisplay = false;
  inspectionPlanModalDisplay = false;
  inspectionCols = [
    { field: 'inspectionId', header: 'ID' },
    { field: 'result', header: 'Status' },
    { field: 'vehicleId', header: 'Vehicle No.' },
    { field: 'startTime', header: 'Inspection date' },
    { field: 'odometer', header: 'Odometer' },
    { field: 'performedBy', header: 'Performed by' },
    { field: 'endTime', header: 'Duration' },
    { field: 'inspectionPlanId', header: 'Inspection plan' },
    { field: 'view', header: 'View' },
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

  constructor(public inspectionService: InspectionService) { }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    // this.inspectionService.getInspections()
    //   .subscribe(res => {
    //     this.inspections = res;
    //   });
    // this.vehicles = this.inspectionService.getVehicles();
    // //this.inspections = this.inspectionService.getInspection();
    // this.inspectionService.getPlans()
    //   .subscribe(res => {
    //     this.plans = res;
    //   });
    this.inspectionService.getPlans().subscribe(res => this.plans = res);
    this.inspectionService.getItems().subscribe(res => this.items = res);

  }

  viewInspection(inspectionId) {
    // const index = this.inspections.map(inspection => inspection.id).indexOf(inspectionId);
    // this.inspection = this.inspections[index];
    // this.inspectionModalDisplay = true;
  }

  getDuration(inspection) {
    const startTime = new Date(inspection.startTime).getTime();
    const endTime = new Date(inspection.endTime).getTime();
    const diff = (endTime - startTime) / 1000;
    return diff;
  }


}



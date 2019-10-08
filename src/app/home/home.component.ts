import { Component } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User } from '../model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  inspectionModalDisplay = false;
  inspectionCols = [
    { field: 'plan.title', header: 'Inspection plan', width: '167px' },
    { field: 'status', header: 'Status', width: '108px' },
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
  isLoading = true;

  constructor(public inspectionService: InspectionService, private router: Router) { }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.inspectionService.getInspections().subscribe(inspections => {
      this.inspections = inspections;
      this.inspectionService.getPlans().subscribe(plans => {
        this.plans = plans;
        this.inspectionService.getItems().subscribe(items => {
          this.items = items;
          this.isLoading = false;
        });
      });
    });
  }

  viewInspection(inspection) {
    this.inspection = inspection;
    this.inspectionModalDisplay = true;
  }

  getFailCount(inspection) {
    return inspection.result.filter(r => r.result === 'Pass').length;
  }

  deleteInspection(id) {
    this.inspectionService.deleteInspection(id).subscribe(() => {
      this.inspectionModalDisplay = false;
      this.inspectionService.getInspections().subscribe(res => this.inspections = res);
    });
  }
}



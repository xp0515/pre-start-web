import { Component, OnInit } from '@angular/core';
import { Inspection, Vehicle, Plan, Item, User } from '../model';
import { InspectionService } from '../inspection.service';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent implements OnInit {

  constructor(public inspectionService: InspectionService) { }

  vehicles: Vehicle[];
  inspections: Inspection[];

  ngOnInit() {

    this.inspectionService.getInspections().subscribe(res => {
      this.inspections = res; console.log(this.inspections, 1);
    });
  }


}

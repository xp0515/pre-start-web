import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection } from '../model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent implements OnInit {

  isLoading = true;
  inspection: Inspection;
  inspectionId: string;
  constructor(public route: ActivatedRoute, private router: Router, public inspectionService: InspectionService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.inspectionId = paramMap.get('id');
      this.inspectionService.getInpection(this.inspectionId).subscribe(inspection => {
        this.inspection = inspection;
        this.isLoading = false;
      });
    });
  }

  getFailCount(inspection) {
    return inspection.result.filter(r => r.result === 'Pass').length;
  }

  deleteInspection(id) {
    this.inspectionService.deleteInspection(id).subscribe(() => this.router.navigate(['']));
  }

}

import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection } from '../model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent implements OnInit {

  isLoading = true;
  inspection: Inspection;
  inspectionId: string;
  signatureUrl = null;
  imgUrl = null;
  base64 = null;
  clientId = localStorage.getItem('client');

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public inspectionService: InspectionService,
    public domSanitizationService: DomSanitizer) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.inspectionId = paramMap.get('id');
      this.inspectionService.getInpection(this.clientId, this.inspectionId).subscribe(inspection => {
        this.inspection = inspection;
        const units = new Uint8Array(this.inspection.signature.data);
        this.signatureUrl = this.domSanitizationService
          .bypassSecurityTrustUrl('data:image/jpg;base64, ' + btoa(String.fromCharCode.apply(null, units)));
        this.isLoading = false;
      });
    });
  }

  getFailCount(inspection) {
    return inspection.result.filter(r => r.result === 'Fail').length;
  }

  markAsRepaired(id) {
    this.inspection.finalStatus = 'Repaired';
    this.inspectionService.updateInspection(this.clientId, id, this.inspection).subscribe(() => this.router.navigate(['']));
  }

  markAsFailed(id) {
    this.inspection.finalStatus = 'Fail';
    this.inspectionService.updateInspection(this.clientId, id, this.inspection).subscribe(() => this.router.navigate(['']));
  }

  deleteInspection(id) {
    this.inspectionService.deleteInspection(this.clientId, id).subscribe(() => this.router.navigate(['']));
  }

}

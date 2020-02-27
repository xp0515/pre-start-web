import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection } from '../model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/api';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';

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
    public domSanitizationService: DomSanitizer,
    public confirmationService: ConfirmationService) { }

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

  exportPDF() {
    html2canvas(document.querySelector('#capture')).then(canvas => {
      const data = canvas.toDataURL();
      const docDefinition = {
        content: [{
          image: data,
          width: 700
        }]
      };
      pdfMake.createPdf(docDefinition).download(`${this.inspectionId}.pdf`);
    });
  }

  confirmDeleteItem(id) {
    this.confirmationService.confirm({
      message: 'Are you sure to delete this inspection result?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteInspection(id);
      },
      reject: () => {
      }
    });
  }

  deleteInspection(id) {
    this.inspectionService.deleteInspection(this.clientId, id).subscribe(() => this.router.navigate(['']));
  }

}

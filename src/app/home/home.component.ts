import { Component, ViewChild, OnInit } from '@angular/core';
import { InspectionService } from '../inspection.service';
import { Inspection, Vehicle, Plan, Item, User } from '../model';
import { SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FilterUtils } from 'primeng/components/utils/filterutils';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // @ViewChild('dt', { static: false }) _table: Table;

  inspectionCols = [
    { field: 'plan.title', header: 'Inspection plan', width: '167px' },
    { field: 'finalStatus', header: 'Status', width: '108px' },
    { field: 'vehicle.rego', header: 'Vehicle', width: '108px' },
    { field: 'startTime', header: 'Inspection date', width: '195px' },
    { field: 'location', header: 'Location', width: '195px' },
    { field: 'odometer', header: 'Odometer', width: '129px' },
    { field: 'performedBy', header: 'Performed by', width: '150px' },
    { field: 'duration', header: 'Duration', width: '120px' },
    { field: 'weightsResult', header: 'Mass management', width: '200px' },
  ];
  planCols = [
    { field: 'title', header: 'Inspection plan title' },
    { field: 'vehicle', header: 'Vehicles' },
    { field: 'item', header: 'Inspection items' },
    { field: 'frequency', header: 'Inspection frequency' },
    { field: 'lastModify', header: 'Last modified' },
    { field: 'edit', header: 'Edit' },
  ];
  inspections: Inspection[] = [];
  vehicles: Vehicle[];
  inspection: Inspection;
  plans: Plan[] = [];
  items: Item[] = [];
  delayedCount = 0; failedCount = 0; repairedCount = 0; passCount = 0; completedCount = 0;
  planOptions; statusOptions; vehicleOptions; driverOptions: SelectItem[];
  odometerFilter; durationFilter: number;
  odometerTimeout; durationTimeout: any;
  isLoading = true;
  uploadedFiles: any[] = [];
  clientId = localStorage.getItem('client');
  rangeDates: Date[];
  // dateRange = [];

  constructor(private inspectionService: InspectionService, public router: Router, private userService: UserService) { }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    FilterUtils['dateRangeFilter'] = (value, filter): boolean => {
      if (this.rangeDates === null || this.rangeDates.length === 0) {
        return true;
      }
      return moment(value).isBetween(moment(this.rangeDates[0]), moment(this.rangeDates[1]));
    };

    this.inspectionService.getInspections(this.clientId).subscribe(inspections => {
      this.inspections = inspections;
      if (this.inspections.length) {
        this.delayedCount = this.inspections.filter(i => i.finalStatus === 'Delayed').length;
        this.failedCount = this.inspections.filter(i => i.finalStatus === 'Fail').length;
        this.repairedCount = this.inspections.filter(i => i.finalStatus === 'Repaired').length;
        this.passCount = this.inspections.filter(i => i.finalStatus === 'Pass').length;
        this.completedCount = this.inspections.length;
      }
      this.inspectionService.getPlans(this.clientId).subscribe(plans => {
        this.plans = plans.filter(plan => plan.disabled !== true);
        this.inspectionService.getItems(this.clientId).subscribe(items => {
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

    this.inspectionService.getPlans(this.clientId).subscribe(plans => {
      this.planOptions = [];
      plans.forEach(plan => this.planOptions.push({ label: plan.title, value: plan.title }));
    });

    this.inspectionService.getVehicles(this.clientId).subscribe(vehicles => {
      this.vehicleOptions = [];
      if (vehicles) {
        vehicles.forEach(vehicle => this.vehicleOptions.push({ label: vehicle.rego, value: vehicle.rego }));
      }
    });

    this.userService.getDrivers(this.clientId).subscribe(drivers => {
      this.driverOptions = [];
      drivers.forEach(driver => this.driverOptions.push({ label: driver.name, value: driver.name }));
    });



  }


  getFailCount(inspection) {
    return inspection.result.filter(r => r.result === 'Fail').length;
  }

  viewInspection(id) {
    this.inspectionService.getInpection(this.clientId, id).subscribe(() => this.router.navigate([`inspections/${this.clientId}/${id}`]));
  }

  onCreatePlan() {
    this.router.navigate([`new-plan/${this.clientId}`]);
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

  clearDateFilter() {
    console.log(1)
    this.rangeDates = null;
  }



  // exportPdf() {
  //   import("jspdf").then(jsPDF => {
  //     import("jspdf-autotable").then(x => {
  //       const doc = new jsPDF.default(0, 0);
  //       doc.autoTable(this.exportColumns, this.cars);
  //       doc.save('primengTable.pdf');
  //     })
  //   })
  // }

  // exportExcel() {
  //   import("xlsx").then(xlsx => {
  //     const worksheet = xlsx.utils.json_to_sheet(this.getCars());
  //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     this.saveAsExcelFile(excelBuffer, "primengTable");
  //   });
  // }

  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   import("file-saver").then(FileSaver => {
  //     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //     let EXCEL_EXTENSION = '.xlsx';
  //     const data: Blob = new Blob([buffer], {
  //       type: EXCEL_TYPE
  //     });
  //     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  //   });
  // }

  // check() {

  //   this.userService.setCookies().subscribe(res => {
  //     console.log(res);
  //     this.inspectionService.check().subscribe(res => console.log(res));
  //   });
  // }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { InspectionComponent } from './inspection/inspection.component';
import { NewPlanComponent } from './new-plan/new-plan.component';

import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    InspectionComponent,
    NewPlanComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'new-plan', component: NewPlanComponent },
      { path: 'plans/:id', component: NewPlanComponent }
    ]),
    TabViewModule,
    TableModule,
    ButtonModule,
    DialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatDividerModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    CheckboxModule,
    ConfirmDialogModule,
    SharedModule,
    ToastModule,
    RadioButtonModule,
    PanelModule,
    ScrollPanelModule,
    DropdownModule,
    ProgressSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AdminGuard } from './auth/admin.guard';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { InspectionComponent } from './inspection/inspection.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NewClientComponent } from './newclient/newclient.component';

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
import { MultiSelectModule } from 'primeng/multiselect';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { SliderModule } from 'primeng/slider';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TreeModule } from 'primeng/tree';
import { PickListModule } from 'primeng/picklist';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    NewPlanComponent,
    InspectionComponent,
    LoginComponent,
    RegisterComponent,
    NewClientComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'dashboard', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'new-plan/:clientId', component: NewPlanComponent, canActivate: [AuthGuard] },
      { path: 'plans/:id', component: NewPlanComponent, canActivate: [AuthGuard] },
      { path: 'inspections/:clientId/:id', component: InspectionComponent, canActivate: [AuthGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: 'newclient', component: NewClientComponent, canActivate: [AuthGuard, AdminGuard] },
      { path: '**', redirectTo: '' }
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
    ProgressSpinnerModule,
    MultiSelectModule,
    MessagesModule,
    MessageModule,
    SliderModule,
    FileUploadModule,
    ProgressBarModule,
    OverlayPanelModule,
    TreeModule,
    PickListModule,
    CalendarModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

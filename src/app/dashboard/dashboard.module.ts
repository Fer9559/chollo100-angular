import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { CreateCholloComponent } from './pages/create-chollo/create-chollo.component';
import { UpdateCholloComponent } from './pages/update-chollo/update-chollo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    DashboardLayoutComponent,
    CreateCholloComponent,
    UpdateCholloComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ]
})
export class DashboardModule { }

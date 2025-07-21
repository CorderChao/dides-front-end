import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScansManagementComponent } from './view/scans-management/scans-management.component';
import { SharedModule } from '../shared/shared.module';
import { ScansManagementRoutingModule } from './scans-management-routing.module';



@NgModule({
  declarations: [
    ScansManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ScansManagementRoutingModule
  ]
})
export class ScansManagementModule { }

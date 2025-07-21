import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosManagementRoutingModule } from './pos-management-routing.module';
import { DeviceManagementComponent } from './view/device-management/device-management.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DeviceManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PosManagementRoutingModule
  ]
})
export class PosManagementModule { }

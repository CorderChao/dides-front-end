import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceManagementComponent } from './view/device-management/device-management.component';

const routes: Routes = [
      {path: '', component: DeviceManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosManagementRoutingModule { }

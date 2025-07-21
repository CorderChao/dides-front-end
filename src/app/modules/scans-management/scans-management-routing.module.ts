import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScansManagementComponent } from './view/scans-management/scans-management.component';

const routes: Routes = [
  {path: '', 
  component: ScansManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScansManagementRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MailboxComponent } from "../modules/shared/mailbox/mailbox.component";
import { DashboardComponent } from "../modules/dashboards/dashboard/dashboard.component";


const routes: Routes = [
  {
    path: "",
  },
  {
    path: 'inbox', 
    component: MailboxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

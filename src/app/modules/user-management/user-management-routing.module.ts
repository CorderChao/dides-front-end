import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersAccountsComponent } from "./view/users-accounts/users-accounts.component";

const routes: Routes = 
[
  {  path: "user-management", 
  data: {
    parentNode: "Users Management",
    childNode: "User's Accounts",
    title: "Users Management",
    active: true,
  },
     component: UsersAccountsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserManagementRoutingModule } from "./user-management-routing.module";
import { SharedModule } from "../shared/shared.module";
import { CreateUserComponent } from "./view/create-user/create-user.component";
import { UsersAccountsComponent } from "./view/users-accounts/users-accounts.component";
import { NormalParkingDialogComponent } from "../shared/components/normal-parking-dialog/normal-parking-dialog.component";
import { ChangeDefaultPasswordComponent } from './view/change-default-password/change-default-password.component';



@NgModule({
  declarations: [CreateUserComponent, ChangeDefaultPasswordComponent, UsersAccountsComponent, NormalParkingDialogComponent],
  imports: [
    CommonModule, 
     UserManagementRoutingModule, 
     SharedModule
  ],
})
export class UserManagementModule {}

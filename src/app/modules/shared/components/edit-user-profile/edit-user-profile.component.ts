import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDefaultPasswordComponent } from 'src/app/modules/user-management/view/change-default-password/change-default-password.component';
import { ToastService } from '../../services/toast.service';
import { AuthenticationService } from 'src/app/modules/user-management/services/authentication.service';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.scss'
})
export class EditUserProfileComponent {
  public title: string;
  public label: string;
  public user: any;

  public profileform: FormGroup;
  from: any;

  constructor(
    private dialogRef: MatDialogRef<ChangeDefaultPasswordComponent>,
    private toastSvc: ToastService,
    private userSvc: AuthenticationService,
    private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.title = data.title;
      this.label = data.label;
      this.from = data.from;      
      this.user = data.user
      console.log("this.user", this.user);
      
  }

  ngOnInit() {
    this.profileform = this.initprofileform();
  }

  initprofileform(): FormGroup {
    return this.formBuilder.group({
      tinNumber: [this.user.identificationCardNumber, Validators.required],
      phoneNumber: [this.user.phoneNumber, Validators.required],
      address: [this.user.address, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      middleName: [this.user.middleName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
    })
  }

  public editUserProfile(payload: any){
     this.user.identificationCardNumber = payload.tinNumber,
     this.user.phoneNumber = payload.phoneNumber,
     this.user.address = payload.address,
     this.user.firstName = payload.firstName,
     this.user.middleName = payload.middleName,
     this.user.lastName = payload.lastName
   
      this.userSvc.editUser(this.user.uuid, this.user).subscribe((response)=> {
        if (response.code === 6000) {
          this.dialogRef.close(response);
        }else{
         this.toastSvc.error('error', `${response.description}`, 5000)
        }
        
      });

  }

 

}


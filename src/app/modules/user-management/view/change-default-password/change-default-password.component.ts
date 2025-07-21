import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/modules/shared/services/toast.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-change-default-password',
  templateUrl: './change-default-password.component.html',
  styleUrl: './change-default-password.component.scss'
})
export class ChangeDefaultPasswordComponent {
  public title: string;
  public label: string;
  public user: any;

  public resetform: FormGroup;
  from: any;

  constructor(
    private dialogRef: MatDialogRef<ChangeDefaultPasswordComponent>,
    private toastSvc: ToastService,
    private userSvc: AuthenticationService,
    private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.title = data.title;
      this.label = data.label;
      this.from = data.from;      
      this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit() {
    this.resetform = this.initResetForm();
  }

  initResetForm(): FormGroup {
    return this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    })
  }

  public resetPassword(payload: any){

    if(payload.newPassword === payload.repeatPassword){
      const payloadData = {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword
      }
      this.userSvc.changePassword(this.user.uuid, payloadData).subscribe((response)=> {
        this.dialogRef.close(response);
      });
    } else {
      this.toastSvc.error('Error','New Password does not match Repeat Password, try again',6000);
    }
  }

  public closeWindow(){
    this.toastSvc.warning('Warning','You can not close this window, it will close automatically after changing your default password', 6000);
  }

}

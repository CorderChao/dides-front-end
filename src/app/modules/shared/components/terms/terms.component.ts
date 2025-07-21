import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/modules/service/common.service';
import { ToastService } from 'src/app/modules/service/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
  title: any;
  label: any;
  action: any;
  currentUser: any;
  terms: any;
  public readonly baseUrl: string = `${environment.BASE_API}:8083/api/v1`;
  organization: any;
  logo: string;

constructor(
   private toastSvc: ToastService,
  private commonSvc: CommonService,
   private dialogRef: MatDialogRef<TermsComponent>,
@Inject(MAT_DIALOG_DATA) public  data:any
){
console.log("Passsed Data", data);
this.title = data.title;
this.label = data.label;
this.action = data.action;
this.getSubSourcesByUuid(data.subSourceId);
    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));
    this.organization = this.currentUser.organization;
    this.logo = `${this.baseUrl}/storage/images/${data.logo}`;
    console.log("this.organizationId",localStorage.getItem('logoName'));
}



  ngOnInit() {

  }

  getSubSourcesByUuid(subSourceId: any) {
    this.commonSvc.getSubSourcesByUuid(subSourceId).subscribe((response) => {
      if (response.code === 6000) {
        this.terms = response.data.itemTermsAndConditions;
        console.log("SubSource", this.terms);
      }
    });
  }

}

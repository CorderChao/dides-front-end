import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/modules/service/common.service';
import { ToastService } from 'src/app/modules/service/toast.service';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbCarouselModule, NgbNavModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preview-application',
  templateUrl: './preview-application.component.html',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    NgbAccordionModule,
    CommonModule,
    ReactiveFormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    NgbNavModule,
    RouterModule,
  ],
  styleUrl: './preview-application.component.scss'
})
export class PreviewApplicationComponent {
public title:string;
public application: any;
  code: any;
  currentUser: any;
  organizationId: any;
  label: any;

constructor(
   private toastSvc: ToastService,
    // private setSvc: SettingsService,
  private commonSvc: CommonService,
   private dialogRef: MatDialogRef<PreviewApplicationComponent>,
@Inject(MAT_DIALOG_DATA) public  data:any
){
console.log("Passsed Data", data);
this.title = data.title;
this.label = data.label;
this.code = data.code;
this.application = data.application;

    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));
    this.organizationId = this.currentUser.organization;

    console.log("this.organizationId",this.organizationId);
}

  ngOnInit() {

  }


  initialize(applicationId: any) {
    let payload = [];
    this.commonSvc
      .rollbackApplication(applicationId, payload)
      .subscribe((response) => {
      if(response.code === 6000){
          Swal.fire("Information", `${response.description}`, "success");
        }else{
         Swal.fire("Sorry!", `${response.description}`, "error");
        }
      });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { TableDataRow } from 'src/app/modules/data-table/table-data-row';
import { CommonService } from 'src/app/modules/service/common.service';
import { ToastService } from 'src/app/modules/service/toast.service';
import Swal from 'sweetalert2';
import { PreviewBillComponent } from '../preview-bill/preview-bill.component';

@Component({
  selector: 'app-list-bills',
  templateUrl: './list-bills.component.html',
  styleUrl: './list-bills.component.scss'
})
export class ListBillsComponent {
public title:string;
public application: any;
  code: any;
  currentUser: any;
  organizationId: any;
  label: any;
  bills: any;
billPayload: any;
  name: any;

constructor(
   private toastSvc: ToastService,
    private dialog: MatDialog,
      private commonSvc: CommonService,
   private dialogRef: MatDialogRef<ListBillsComponent>,
@Inject(MAT_DIALOG_DATA) public  data:any
){
console.log("Passsed Data", data);
this.title = data.title;
this.label = data.label;
this.code = data.code;
this.bills = data.bill;
this.name = data.name;

    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));
    this.organizationId = this.currentUser.organization;

    console.log("this.organizationId",this.bills);

// this.commonSvc.searchBillById(this.billPayload.billUid).subscribe((response) => {
// console.log();
// if(response.code === 6000){
//   this.bills = response.data;
//   console.log("Billss returnedddddd!!!!",this.bills);
// }
// })
}

  ngOnInit() {

  }

  columns: TableDataRow[] = [
    { header: "No", value: "index" },
    { header: "Bill Date", value: "createdDate" },
    { header: "Bill For", value: "billFor" },
    { header: "Amount", value: "bill" },
    { header: "Status", value: "status" },
    {
      header: "Actions",
      value: "actions",
      class: "d-flex justify-content-center",
    },
  ];


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

  previewBill(item:any) {
  console.log("Here Iam", item);
    const data = {
      title: "Preview Bill",
      label: "preview bill",
      action: "preview",
      bill: item?.billUid
    };
    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = "65%";
    config.position = {
      top: "60px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.dialog.open(PreviewBillComponent, config);
    dialog.afterClosed().subscribe(() => {
    });
  }
}

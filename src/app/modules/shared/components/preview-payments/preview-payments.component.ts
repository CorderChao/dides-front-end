import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { TableDataRow } from 'src/app/modules/data-table/table-data-row';
import { CommonService } from 'src/app/modules/service/common.service';
import { ToastService } from 'src/app/modules/service/toast.service';
import Swal from 'sweetalert2';
import { PreviewBillComponent } from '../preview-bill/preview-bill.component';
import { PreviewReceiptComponent } from '../preview-receipt/preview-receipt.component';

@Component({
  selector: 'app-preview-payments',
  templateUrl: './preview-payments.component.html',
  styleUrl: './preview-payments.component.scss'
})
export class PreviewPaymentsComponent {
public title:string;
public application: any;
  code: any;
  currentUser: any;
  organizationId: any;
  label: any;
  payments: any;
  invoice: any;
  gepgReceipt: any;

constructor(
   private toastSvc: ToastService,
    private dialog: MatDialog,
      private commonSvc: CommonService,
   private dialogRef: MatDialogRef<PreviewPaymentsComponent>,
@Inject(MAT_DIALOG_DATA) public  data:any
){
console.log("Passsed Data33333333", data);
this.title = data.title;
this.label = data.label;
this.code = data.code;
this.payments = data.payments;
 //this.gepgReceipt = data.payments[0]?.gepgReceipt;
 //this.fetchPaymentDetails(this.gepgReceipt);
// console.log("Passsed GepGReceipt", this.gepgReceipt);

    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));
    this.organizationId = this.currentUser.organization;

    console.log("this.organizationId",this.organizationId);
}

  ngOnInit() {

  }

  columns: TableDataRow[] = [
    { header: "No", value: "index" },
    { header: "Payment Date", value: "createdDate" },
    { header: "Paid Amount", value: "paidAmount" },
    // { header: "Control No", value: "controlNumber" },
    // { header: "Payment For", value: "billFor" },

    //  { header: "Outstanding", value: "balance" },
    {
      header: "Actions",
      value: "actions",
      class: "d-flex justify-content-center",
    },
  ];


//   fetchPaymentDetails(receipt: any) {

//     // this.payments = response.data;
// console.log("Payments",response.data);
//       });
//   }


  previewReceipt(item:any) {
let payload = {
  controlNumber: "",
  dateFrom: "",
  dateTo: "",
  payerName: "",
  pspReference: "",
  gepgReference: item.gepgReceipt,
  councilCode: "",
  regionCode: ""
}
    this.commonSvc.getPaymentByReceipt(payload)
      .subscribe((response) => {


  console.log("Here Iam", item);
    const data = {
      title: "Preview Receipt",
      label: "preview Receipt",
      action: "preview",
      payment: response.data[0]
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

    const dialog = this.dialog.open(PreviewReceiptComponent, config);
    dialog.afterClosed().subscribe(() => {
    });
 });
  }
}

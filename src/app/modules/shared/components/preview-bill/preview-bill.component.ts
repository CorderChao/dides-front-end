import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription, map, of } from "rxjs";
import { SharedModule } from "../../shared.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbAccordionModule, NgbCarouselModule, NgbNavModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { CommonService } from "src/app/modules/service/common.service";
import { environment } from "src/environments/environment.prod";
import { toWords } from 'number-to-words';

@Component({
  selector: "app-preview-bill",
  templateUrl: "./preview-bill.component.html",
  styleUrl: "./preview-bill.component.scss",
})
export class PreviewBillComponent {
  signature: string;
  subscriptions: Subscription = new Subscription();
  today = new Date();
  spCode = "SI1001";
  bill$: Observable<any>;
  public readonly baseUrl: string = `${environment.BASE_API}:8083/api/v1`;
  title = "Government Bill";
  billNumber: string;
  qrdata: any;
  user: string;
  currentDate: any;
  invoice: any;
  label: any;
  action: any;
  billDetails: any;
  organization: any;
  billId: any;
  logo: string;
  logoName: string;

  constructor(
    private commnSvc: CommonService,
    //private store: Store<AppState>,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<PreviewBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("Passed Data",data)
    this.title = data.title;
    this.label = data.label;
    this.action = data.action;
    this.currentDate = new Date();
    //this.billNumber = this.route.snapshot.paramMap.get('uid');
    this.billId = data.bill;
    this.fetchInvoice();


  }

  ngOnInit(): void {


    this.user = "John Doe";
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  writeWords(amount: number) {
      return toWords(amount);
  }

  countTotal(billItems: any[]): number {
      let total = 0;

      billItems?.forEach((item) => {
          total += item?.totalAmount;
      });
      return total;
  }

  fetchInvoice() {
    
    let invoice;; 

 // Inside your component class
this.commnSvc.searchBillById(this.billId).subscribe((data) => {
  this.invoice = data.data;
   this.logo = `${this.baseUrl}/storage/images/${this.invoice?.organization?.logo}`; 
  console.log(this.invoice);

  // Create an array to hold bill items
  const billItems = [];

  // Loop through serviceDetails and populate billItems
  this.invoice.billItems.forEach((detail) => {
    const billItem = {
      description: detail.billItemDescription,
      quantity: 1,
      totalAmount: detail.billItemAmount,
    };
    billItems.push(billItem);
  });

  this.bill$ = of({
    controlNumber: this.invoice.controlNumber,
    billNumber: this.invoice.reference,
    spCode: this.invoice.organization?.spCode,
    payerName: this.invoice.payerName,
    payerPhone: this.invoice.payerPhone,
    currency: this.invoice.currencyCode,
    controlNumberExpiredDate: this.invoice.expiryDate,
    billDate: this.invoice.createdDate,
    billItems: billItems,
    paidAmount: this.invoice.billAmount
  });

  this.qrdata = this.bill$.pipe(
    map((data) => {
      return {
        opType: '2',
        shortCode: '001001',
        billReference: this.invoice.reference,
        amount: this.invoice.billAmount,
        billCcy: this.invoice.currencyCode,
        billExprDt: this.invoice.expiryDate,
        billPayOpt: this.invoice.billPayOption,
        billRsv01: 'Council Revenue Collection | John Doe',
      };
    })
  );
});

       
  }


printDiv(divId: string) {
    const printContent = document.getElementById(divId)?.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '', '');
      // printWindow?.document.open();
      printWindow?.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
             $text-color: #3b444b;

:host {
  .certificate-content {
    border: 10px solid var(--primary-color);
    padding: 20px;
    background: white;

    .text-left {
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    .cert-heading {
      text-align: center;

      .client-logo {
        padding-top: 8px;
        width: 90%;
      }

      > div:first-child {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .cert-schedule {
        margin-top: 20px;
        margin-bottom: 20px;

        span {
          display: inline-block;
          border-top: 1px solid #c9c9c9;
          border-bottom: 1px solid #c9c9c9;
          padding-top: 5px;
          padding-bottom: 5px;
        }
      }
    }

    .cert-title {
      text-align: center;
      font-weight: 600;
      margin-top: 20px;
    }

    .cert-text {
      margin-top: 20px !important;
      text-align: justify;
      padding: 15px 30px !important;

      .text {
        //text-align: center;
        margin-bottom: 5px;
      }
    }

    .dotted {
      border-bottom: 1px dotted #555;
      display: inline-block;
      padding-bottom: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .cert-flex-signatures {
      display: flex;
      flex-flow: row wrap;
      text-align: center;
      margin-top: 20px;
      align-items: center;

      .mat-icon {
        height: 80px !important;
        width: 80px !important;
      }

      > div:first-child {
        width: 30% !important;
        min-width: 30% !important;
        max-width: 30% !important;
      }

      > div:last-child {
        width: 30% !important;
        min-width: 30% !important;
        max-width: 30% !important;
      }

      > div:nth-child(2) {
        width: 40%;
        min-width: 40% !important;
        max-width: 40% !important;
      }

      img {
        height: 100px;
        width: auto;
      }

      span.director {
        border-top: 1px solid #999;
        display: inline-block;
        margin-top: 5px;
      }

      .qr-code {
        text-align: right;
        padding-right: 10px;
      }
    }

    .cert-conditions {
      margin-top: 20px;
      color: rgba(0, 0, 0, 0.5);

      .condition {
        display: flex;
        flex-flow: row wrap;
        width: 100%;

        > div:first-child {
          padding-left: 20px;
          width: 10% !important;
          min-width: 10% !important;
          max-width: 10% !important;
        }

        > div:last-child {
          width: 90% !important;
          min-width: 90% !important;
          max-width: 90% !important;
        }
      }
    }
  }

  .qrcode {
     width: 140px;
     height: 130px;
    border-radius: 4px;
    display: flex;
    justify-content: flex-end;
    border: 7px solid white;
    align-content: flex-end;
    text-align: center;
    padding: 5px;
  }

  .bb-dotted {
    border-bottom: 2px dotted black;
  }

  .print-certificate {
    position: fixed;
    right: 20px;
    bottom: 20px;

    button {
      display: flex;
      // align-items: center;
      span {
        padding-left: 5px;
      }
    }
  }
}

::ng-deep {
  qrcode {
    .qrcode {
      canvas {
        width: 150px !important;
        height: 150px !important;
      }
    }
  }
}

// PRINTING VALUES
.print-certificate {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9;
  button {
    display: flex;
    // align-items: center;
    span {
      padding-left: 5px;
    }
  }
}

@media print {
  .content-navigations {
    display: none !important;
  }

  h2 {
    padding-top: 5px;
    font-size: 18px;
  }

  h3 {
    font-size: 18px;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .col-md-1 {
    flex: 0 0 100% !important;
    max-width: 8.3% !important;
  }
  .col-md-2 {
    flex: 0 0 100% !important;
    max-width: 16.6% !important;
  }
  .col-md-3 {
    flex: 0 0 100% !important;
    max-width: 24.9% !important;
  }
  .col-md-4 {
    flex: 0 0 100% !important;
    max-width: 33.2% !important;
  }
  .col-md-5 {
    flex: 0 0 100% !important;
    max-width: 41.5% !important;
  }
  .col-md-6 {
    flex: 0 0 100% !important;
    max-width: 49.8% !important;
  }
  .col-md-7 {
    flex: 0 0 100% !important;
    max-width: 58.1% !important;
  }

  .col-md-8 {
    flex: 0 0 100% !important;
    max-width: 66.4% !important;
  }

  .col-md-9 {
    flex: 0 0 100% !important;
    max-width: 74.7% !important;
  }

  .col-md-10 {
    flex: 0 0 100% !important;
    max-width: 83% !important;
  }

  .col-md-11 {
    flex: 0 0 100% !important;
    max-width: 91.3% !important;
  }

  .certificate-content {
    border: 10px solid var(--primary-color);
    background: white;
    width: 100% !important;
    min-height: 100% !important;
    height: max-content !important;
    display: block;
    position: relative;
    margin-bottom: 0.5cm;
    box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);

    .text-left {
      text-align: left;
    }

    .text-right {
      text-align: right;
    }

    .cert-heading {
      text-align: center;
      margin: 10px 20px !important;

      .client-logo {
        padding-top: 8px;
        width: 100%;
      }

      > div:first-child {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .cert-schedule {
        margin-top: 20px;
        margin-bottom: 20px;

        span {
          display: inline-block;
          border-top: 1px solid whitesmoke;
          border-bottom: 1px solid whitesmoke;
          padding-top: 5px;
          padding-bottom: 5px;
        }
      }
    }

    .cert-title {
      text-align: center;
      font-weight: 600;
      margin-top: 20px;
    }

    .cert-text {
      margin-top: 20px !important;
      text-align: justify;
      padding: 15px 30px !important;

      .text {
        //text-align: center;
        margin-bottom: 5px;
      }
    }

    .dotted {
      border-bottom: 1px dotted #555;
      display: inline-block;
      padding-bottom: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .cert-flex-signatures {
      display: flex;
      flex-flow: row wrap;
      text-align: center;
      margin-top: 20px;
      align-items: center;

      .mat-icon {
        height: 80px !important;
        width: 80px !important;
      }

      > div:first-child {
        width: 30% !important;
        min-width: 30% !important;
        max-width: 30% !important;
      }

      > div:last-child {
        width: 30% !important;
        min-width: 30% !important;
        max-width: 30% !important;
      }

      > div:nth-child(2) {
        width: 40%;
        min-width: 40% !important;
        max-width: 40% !important;
      }

      img {
        height: 100px;
        width: auto;
      }

      span.director {
        border-top: 1px solid #999;
        display: inline-block;
        margin-top: 5px;
      }

      .qr-code {
        text-align: right;
        padding-right: 10px;
      }
    }
  }

  .cert-text {
    width: 100%;
    .row {
      width: 100%;
      position: relative;
    }
  }

  .bottom {
    font-size: small;
    padding: 10px;
  }

  .bottom-end {
    font-size: small;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 10px auto;
  }

  .underline {
    border-bottom: 1px solid $text-color;
    padding: 5px;
  }

  .col-md-12 {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .offset-md-1 {
    margin-left: 0px !important;
  }

  .print-certificate,
  .version {
    display: none !important;
  }

  .cert-bottom {
    padding: 5px 20px !important;
  }
  .col-xxl-12{
    height: 100px !important;
    overflow: auto;
  }
}


            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow?.document.close();
       printWindow?.print();
    }
  }


}

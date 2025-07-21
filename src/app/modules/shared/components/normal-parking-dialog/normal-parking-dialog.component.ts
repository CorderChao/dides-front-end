import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PublicService } from '../service/public-service.service';
import { CommonService } from 'src/app/modules/service/common.service';

@Component({
  selector: 'app-normal-parking-dialog',
  templateUrl: './normal-parking-dialog.component.html',
  styleUrl: './normal-parking-dialog.component.scss'
})
export class NormalParkingDialogComponent {

  public title: string;
  public action: string;
  public label: string;
  public user: any;
  public form: FormGroup;
  public paymentForm: FormGroup;
  public paymentPlanForm: FormGroup;

  paymentOptions: any[] = [
    { value: 'mobile', name: "Phone" },
    { value: 'bank', name: "Bank" },
  ];

  bills: any[] = [];
  showTable: boolean = false;
  isPayment: boolean = false;
  pspName: string;
  paymentOpt: any ;
  showPhone: boolean = false;
  regions: any[] = [];
  paymentPlans: any[] = [];
  councils: any[] = [];

  constructor(
    private _commonSvc: CommonService,
    private toastSVC: ToastService,
private publicSvc: PublicService,
    private dialogRef: MatDialogRef<NormalParkingDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.action = data.action;
    this.label = data.label;
    this.regions = data.regions;
    
  }

  ngOnInit() {
    this.getAllRegions();
    this.getAllPaymentPalans(); 
    this.form = this.initform();
    this.paymentForm = this.initPaymentform();
    this.paymentPlanForm = this.initPaymentPlanform();
  }

  getAllRegions() {
    this._commonSvc.getAllRegions().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.regions = response.data;
          console.log("regionsss", this.regions);
        }
      }
    });
  }

  onChange(item: any) {
    this._commonSvc.getCouncilByRegionCode(item.target.value).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
        }
      }
    });
  }



  public pay(item: any) {
    this.isPayment = true;
     this.paymentForm.patchValue({plateNumber: item.payerName});
     this.paymentForm.patchValue({controlNumber: item.controlNumber});
     this.paymentForm.patchValue({amount: item.billAmount});
  }

  public initform(): FormGroup {
        return this.formBuilder.group({
          payerName: ["", Validators.required],
          billPayed: [false, Validators.required],
        });
      }

      public initPaymentform(): FormGroup {
        return this.formBuilder.group({
          controlNumber: ["", Validators.required],
          plateNumber: ["", Validators.required],
          amount: ["", Validators.required],
          paymentOption: ["", Validators.required],
          phoneNumber: ["", Validators.required]
        });
      }

      public initPaymentPlanform(): FormGroup {
        return this.formBuilder.group({
          region: ["", Validators.required],
          plateNumber: ["", Validators.required],
          council: ["", Validators.required],
          paymentPlan: ["", Validators.required],
          phoneNumber: ["", Validators.required]
        });
      }

      selectedValue(item: any){
        this.showPhone = true;
        if (item === 'tigo_pesa') {
          this.pspName = 'TIGO';
        } else if(item === 'halo_pesa'){
           this.pspName = 'Halotel';
        }else if(item === 'airtel_pesa'){
          this.pspName = 'Airtel';
        }else if(item === 'voda_pesa'){
          this.pspName = 'Vodacom';
        }
      }

      paymentOption(opt: any){
        this.paymentOpt = opt;
      }

  public save() {

  }

  searchData(item: any) {
      let payload = {
        controlNumber: "",
        dateFrom: "",
        dateTo: "",
        amountFrom: "",
        amountTo: "",
        payerName: item.payerName,
        billPayed: item.billPayed,
        sourceId: "",
        regionCode: "",
        councilCode: "",
      }
     this.publicSvc.searchBills(payload).subscribe((response) => {
        if (response.code === 6000) {
           this.showTable = true;
          this.bills = response.data;
        }else{
          this.toastSVC.warning('info', `${response.description}`, 5000);
        }
      });
      
 
  }

  
  onRegionChange(region: any) {
    this._commonSvc.getCouncilByRegionCode(region.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
        } 
      }
    });
  }

  getAllPaymentPalans() {
    this.publicSvc.getAllPaymentPlans().subscribe({
      next: (response) => {
        if (response.code === 6000) {
        this.paymentPlans = response.data;
        console.log(this.paymentPlans);
        
        } else if (response.code === 6004) {
          this.paymentPlans = [];
        } else if (response.code !== 6000 && response.code !== 6004) {
          this.toastSVC.warning("Error", "Unable to fetch data", 5000);
          this.paymentPlans = [];
        }
      },
    });
  }


public validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!allowedKeys.includes(event.key) && !/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  public registerPaymentPlan(){

  }


}


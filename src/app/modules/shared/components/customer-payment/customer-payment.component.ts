import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { NgbCarouselModule, NgbNavModule, NgbOffcanvas, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { Router, RouterModule } from "@angular/router";
import { HomepageComponent } from "../homepage/homepage.component";
import { Store } from "@ngrx/store";
import { RootReducerState } from "src/app/pages/store";
import { PublicService } from "../service/public-service.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-customer-payment",
  standalone: true,
  imports: [
    HomepageComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    NgbNavModule,  
    RouterModule
    ],
  templateUrl: "./customer-payment.component.html",
  styleUrl: "./customer-payment.component.scss",
})
export class CustomerPaymentComponent implements OnInit {

  layout: string | undefined;
  mode: string | undefined;
  width: string | undefined;
  position: string | undefined;
  topbar: string | undefined;
  size: string | undefined;
  sidebarView: string | undefined;
  sidebar: string | undefined;
  attribute: any;
  sidebarImage: any;
  sidebarVisibility: any;
  preLoader: any;

  loginForm!: UntypedFormGroup;
  paymentForm: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  title: string | undefined;
  showNavigationIndicators: any;
  customerHome: boolean = true;
  paymentHome: boolean = false;
  applicationHome: boolean = false;

  
  bills: any[] = [];
  isPayment: boolean = false;
  pspName: string;
  paymentOpt: any ;
  showPhone: boolean = false;




  @ViewChild("filtetcontent") filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();

  
  stepsData = [
    {
      head: 'CHECK OUTSTANDING',
      icon: 'bx-cube-alt',
      description: 'To get information about your Outstandings (Bills), click the button below ',
      stepnumber: 1
    },
    {
      head: 'MAKE PAYMENTS',
      icon: 'bx-spa',
      description: 'To pay your bills click the button below',
      stepnumber: 2
    }
  ];
  actor: any = 'Company';
  billApp: any;
  form: any;
  payload: any;
  formPayment: any;
  phoneName: any;

  constructor(
      private publicSvc: PublicService,
      private formBuilder: UntypedFormBuilder,
      private router: Router, 
      private offcanvasService: NgbOffcanvas,
      private store: Store<RootReducerState>,
      private toastSVC: ToastService
  ) {}

  ngOnInit(): void {
    
    this.loginForm = this.formBuilder.group({
      plateNumber: ['', Validators.required],
      controlNumber: ['', Validators.required],
      isParking: ['', ],
      billPayed: [false]
    });

    this.paymentForm = this.formBuilder.group({
      amount: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      plateNumber: ['', Validators.required],
      controlNumber: ['', Validators.required],
      pspCode: ['', Validators.required]
    });

    this.store.select("layout").subscribe((data) => {
      this.layout = data.LAYOUT;
      this.mode = data.LAYOUT_MODE;
      this.width = data.LAYOUT_WIDTH;
      this.position = data.LAYOUT_POSITION;
      this.topbar = data.TOPBAR;
      this.size = data.SIDEBAR_SIZE;
      this.sidebarView = data.SIDEBAR_VIEW;
      this.sidebar = data.SIDEBAR_COLOR;
      this.sidebarImage = data.SIDEBAR_IMAGE;
      this.preLoader = data.DATA_PRELOADER;
      this.sidebarVisibility = data.SIDEBAR_VISIBILITY;
    });
  }

  selectedValue(selectedValue: any){
    this.billApp = selectedValue;
    if (selectedValue === 'parking') {
      this.loginForm.patchValue({isParking: true});
    }else{
      this.loginForm.patchValue({isParking: false});
    }
  }

  selectedMobile(name){
    this.phoneName = name;
  }

  showForm2(value){
    this.formPayment = value;
    if (value === 'controlNumber') {
      this.paymentForm.patchValue({plateNumber: ""});
      this.paymentForm.controls['plateNumber'].clearValidators();
      this.paymentForm.controls['plateNumber'].updateValueAndValidity();
    }else{
      this.paymentForm.patchValue({controlNumber: ""});
      this.paymentForm.controls['controlNumber'].clearValidators();
      this.paymentForm.controls['controlNumber'].updateValueAndValidity();
    }
  }

  showForm(value){
    this.form = value;
    if (value === 'controlNumber') {
      this.loginForm.patchValue({plateNumber: ""});
      this.loginForm.controls['plateNumber'].clearValidators();
      this.loginForm.controls['plateNumber'].updateValueAndValidity();
    }else{
      this.loginForm.patchValue({controlNumber: ""});
      this.loginForm.controls['controlNumber'].clearValidators();
      this.loginForm.controls['controlNumber'].updateValueAndValidity();
    }
  }

  pushPayment(data){

    data.spCode = `SP${data.controlNumber.substring(0,5)}`

   this.payload = {
    "deptCellNum": data.phoneNumber,
    "pspCode": data.pspCode,
    "spCode": data.spCode,
    "controlNumber": data.controlNumber,
    "amountToPay": data.amount
  }
  console.log("payload", this.payload);
  
  this.publicSvc.pushPayment(this.payload).subscribe((response) => {
    if (response.code === 6000) {
     console.log(response);
     
      this.offcanvasService.dismiss();
    }else{
      this.toastSVC.warning('info', `${response.description}`, 5000);
    }
  });

  }


  searchData(item: any) {
      this.payload = {
        controlNumber: item.controlNumber,
        dateFrom: "",
        dateTo: "",
        amountFrom: "",
        amountTo: "",
        payerName: item.plateNumber,
        billPayed: item.billPayed,
        sourceId: "",
        regionCode: "",
        councilCode: "",
      }
  
   this.publicSvc.searchBills(this.payload).subscribe((response) => {
      if (response.code === 6000) {
        response.data.forEach(element => {
          element.isParking = this.loginForm.value.isParking
        });
        this.bills = response.data;
        this.offcanvasService.dismiss();
      }else{
        this.toastSVC.warning('info', `${response.description}`, 5000);
      }
    });
    

}

  get f() { return this.loginForm.controls; }

  ngAfterViewInit() {}

  toggleMenu() {
    document.getElementById("navbarSupportedContent")?.classList.toggle("show");
  }

  windowScroll() {
    const navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 40 ||
      document.documentElement.scrollTop > 40
    ) {
      navbar?.classList.add("is-sticky");
    } else {
      navbar?.classList.remove("is-sticky");
    }

    // Top Btn Set
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "block";
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "none";
    }
  }

  goTo(data: any){
     this.router.navigateByUrl(data);
  }

  openMenu(data: any) {
    this.customerHome = false;
    if (data === 'applications') {
      this.paymentHome = true;
    }
  }

  openEnd(content: TemplateRef<any>, title: string) {
    this.title = title;
    this.offcanvasService.open(content, { position: "end" });
    setTimeout(() => {
      this.attribute = document.documentElement.getAttribute("data-layout");
      if (this.attribute == "vertical") {
        var vertical = document.getElementById(
          "customizer-layout01"
        ) as HTMLInputElement;
        if (vertical != null) {
          vertical.setAttribute("checked", "true");
        }
      }
      if (this.attribute == "horizontal") {
        const horizontal = document.getElementById("customizer-layout02");
        if (horizontal != null) {
          horizontal.setAttribute("checked", "true");
        }
      }
      if (this.attribute == "twocolumn") {
        const Twocolumn = document.getElementById("customizer-layout03");
        if (Twocolumn != null) {
          Twocolumn.setAttribute("checked", "true");
        }
      }
      if (this.attribute == "semibox") {
        const Twocolumn = document.getElementById("customizer-layout04");
        if (Twocolumn != null) {
          Twocolumn.setAttribute("checked", "true");
        }
      }
    }, 100);
  }

  

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
  }

  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
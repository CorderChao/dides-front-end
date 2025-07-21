import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { NgbCarouselModule, NgbNavModule, NgbOffcanvas, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { Router, RouterModule } from "@angular/router";
import { HomepageComponent } from "../homepage/homepage.component";
import { Store } from "@ngrx/store";
import { RootReducerState } from "src/app/pages/store";
import { ToastService } from '../../services/toast.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from "src/app/modules/service/authentication.service";
import { ApplicantRegistrationComponent } from "../applicant-registration/applicant-registration.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";



@Component({
  selector: "app-customer",
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
  templateUrl: "./customer.component.html",
  styleUrl: "./customer.component.scss",
})
export class CustomerComponent implements OnInit {

  private readonly baseUrl: string = `${environment.BASE_API}:8089`;

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
  grd: any;

  loginForm!: UntypedFormGroup;
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

 


  @ViewChild("filtetcontent") filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();

  
  stepsData = [
    {
      head: 'REGISTRATION',
      icon: 'bx-cube-alt',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lectus felis, elementum eget convallis et',
      stepnumber: 1
    },
    {
      head: 'LOGIN',
      icon: 'bx-spa',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lectus felis, elementum eget convallis et',
      stepnumber: 2
    }
  ];
  actor: any = 'Company';
  imageUrl: any = 'assets/images/trr.png';
  orgName: any;
  showButton: boolean = false;
  code: any;
  resetPass: boolean;
  tokenExpiryTime: string;
  currentUser: any;

  constructor(
    private modal: MatDialog,
    private httpClientSvc: HttpClient,
    private authenticationSvc: AuthenticationService,
    private toastSvc: ToastService,
      private formBuilder: UntypedFormBuilder,
      private router: Router, 
      private offcanvasService: NgbOffcanvas,
      private store: Store<RootReducerState>
  ) {}

  ngOnInit(): void { 
    localStorage.clear();
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
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

  searchUserByEmail(){
    this.loginForm.controls['password'].clearValidators();
    this.loginForm.controls['password'].updateValueAndValidity();
    this.resetPass = true;
  }

selectedOrg(value: any): any{
   this.code = value;
  this.showButton = true;
  if (value === 'TRR') {
    this.orgName = 'TARURA';
  } else if (value === 'TRD') {
    this.orgName = 'TANROADS';
  }else{
    this.orgName = 'ROADS FUND BOARD';
  }
}

public forgotPassword(email) {
  let payload = {email: email}
    this.authenticationSvc.fetchUserByEmail(payload).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.authenticationSvc.resetPassword(response.data.uuid).subscribe(
            (response) => {
                if(response.code === 6000){
                  this.resetPass = false;
                  this.toastSvc.success('Information', 'Password reset successfully, Check your e-mail to get new Paassword',5000);
                }
            }
           );
 
        }
      }
});
}


public async onSubmit(payload: any) {
  let userName = payload.username;
  let password = payload.password;
  this.authenticationSvc.login(userName, password).subscribe({
    next: (user: any) => {
      if (user) {
        this.tokenExpiryTime = JSON.stringify(user.expires_in);
        localStorage.setItem('currentClient', JSON.stringify(user.access_token));
        localStorage.setItem('refreshToken', JSON.stringify(user.refresh_token));
        localStorage.setItem('EXPIRE', JSON.stringify(user.refresh_token));
        localStorage.setItem('expireTime', JSON.stringify(user.expires_in));  
        this.httpClientSvc.get(`${this.baseUrl}/api/v1/user/user-info`).subscribe({
          next: (response: any) => {
            if (response.code === 6000) {
               this.router.navigate([`/inbox`]);
              this.currentUser = response.data;
              localStorage.setItem('userInfo', JSON.stringify(response.data));
              this.offcanvasService.dismiss()
              this.toastSvc.success('Hello', 'Welcome ' + this.currentUser.firstName + ' ' + this.currentUser.middleName + ' ' + this.currentUser.lastName, 4000);
            }else{
              Swal.fire('Sorry!', `${response.description}`, "error");
            }
          }
        });
      }
    
    },
    error: (error) => {
      console.error(error);
      Swal.fire("Sorry!", "Please check your username or password", "error");
    },

  });

}

  selectedValue(selectedValue: any){
    this.actor = selectedValue;
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



  /**
   * Password Hide/Show
   */
   toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onCardClick() {
    // You can add navigation logic or emit events here
    console.log('Card clicked!');
  }

  open(): void {
 
      const data = {
        title: "Applicant Registration",
        label: "save",
        action: "save",
      };
      const config = new MatDialogConfig();
      config.data = data;
      config.disableClose = false;
      config.autoFocus = false;
      config.width = "55%";
      config.position = {
        top: "75px",
      };
      config.panelClass = "mat-dialog-box";
      config.backdropClass = "mat-dialog-overlay";
  
      const dialog = this.modal.open(ApplicantRegistrationComponent, config);
      dialog.afterClosed().subscribe((response) => {
        if (response.code === 6000) {
          this.toastSvc.success(
            "Information",
            `${response.decription}`,
            8000
          );
        } else if (response.code !== 6000) {
          this.toastSvc.warning("Information", `${response.description}`, 6000);
        }
      });
    }

}
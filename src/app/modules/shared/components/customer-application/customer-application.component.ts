import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { NgbCarouselModule, NgbNavModule, NgbOffcanvas, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HomepageComponent } from "../homepage/homepage.component";
import { Store } from "@ngrx/store";
import { RootReducerState } from "src/app/pages/store";
import { SharedModule } from '../../shared.module';
import { ToastService } from 'src/app/modules/service/toast.service';
import { CommonService } from 'src/app/modules/service/common.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from "src/app/modules/service/authentication.service";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NormalParkingDialogComponent } from '../normal-parking-dialog/normal-parking-dialog.component';
import { ApplicantRegistrationComponent } from "../applicant-registration/applicant-registration.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-customer-application",
  templateUrl: "./customer-application.component.html",
  styleUrl: "./customer-application.component.scss",
  standalone: true,
  imports: [
    HomepageComponent,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    NgbNavModule,
    RouterModule
  ],
})
export class CustomerApplicationComponent implements OnInit {

  private readonly baseUrl: string = `${environment.BASE_API}:8089`;

  applicantForm: FormGroup;
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
  public sex: any[] = [
    { value: true, name: "Male" },
    { value: false, name: "Female" }
  ]
  public idTypes: any[] = []
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  public selectedValue: any;
  title: string | undefined;
  showNavigationIndicators: any;
  customerHome: boolean = true;
  paymentHome: boolean = false;
  applicationHome: boolean = false;

  dashletsIcons: any[] = [
    {
      title: 'Normal Parking',
      iconName: 'ri-parking-box-fill'
    },
    {
      title: 'Roaming',
      iconName: 'ri-taxi-fill',
    },
    {
      title: 'Advertisement',
      iconName: 'ri-billiards-line',
    },
    {
      title: 'Gas ',
      iconName: 'ri-gas-station-fill',
    },
    {
      title: 'Camps and place',
      iconName: 'ri-tent-fill',
    },
    {
      title: 'Reserve parking',
      iconName: 'ri-reserved-fill',
    },
    {
      title: 'Electricity',
      iconName: 'ri-base-station-line',
    },
    {
      title: 'Water',
      iconName: 'ri-drop-fill',
    },
    {
      title: 'Duct',
      iconName: 'ri-anticlockwise-line',
    },
    {
      title: 'Oil',
      iconName: 'ri-oil-fill',

    },
  ];

  @ViewChild("filtetcontent") filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();


  stepsData = [
    {
      head: 'REGISTRATION',
      icon: 'bx-cube-alt',
      description: 'To register as an Individual, use your NIN or personal TIN to create account, OR as a Company, use company TIN',
      stepnumber: 1
    },
    {
      head: 'LOGIN',
      icon: 'bx-spa',
      description: 'To Login as an Individual, use your NIN or personal TIN , OR  as a Company, use company TIN and password you created',
      stepnumber: 2
    }
  ];
  
  actor: any = 'Company';
  councils: any[] = [];
  regions: any[] = [];
  wards: any[] = [];
  streets: any;
  organizations: any[] = [];
  applicantTypes: any[] = [];
  applicantTypeId: any;
  tokenExpiryTime: string;
  fromTiles: boolean;

  formType: any;
  sources: any[] = [];
  subsources: any[] = [];
  parkingUUid: any;
  code: string;
  orgName: string;
  organizationTypeId: any;
  organization: any;
  filterstrings: string[] = [];
  isAvailable: boolean;
  locked: boolean = false;
  currentUser: any;
  data: any;
  
  constructor(
    private httpClientSvc: HttpClient,
    private modal: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private _commonSvc: CommonService,
    private toastSvc: ToastService,
    private authenticationSvc: AuthenticationService,
    private offcanvasService: NgbOffcanvas,
    private store: Store<RootReducerState>,
    private route: ActivatedRoute
  ) { 
    this.code = this.route.snapshot.paramMap.get("code");
    if (this.code  === 'TRR') {
      this.orgName = 'TANZANIA RURAL AND URBAN ROADS AGENCY (TARURA)';
    } else if (this.code  === 'TRD') {
      this.orgName = 'TANZANIA NATIONAL ROADS AGENCY (TANROADS)';
    }else{
      this.orgName = 'ROADS FUND BOARD (RFB)';
    }
    this._commonSvc
    .getComConfigTpyes("ORGANIZATION_TYPE")
    .subscribe((response) => {
      if (response.code === 6000) {
        for (let i = 0; i < response.data?.length; i++) {
          if (response.data[i].name === "INSTITUTION") {
            this.organizationTypeId = response.data[i]?.setupUUID;
          }
        };
        this.fetchAllOrganizations(this.organizationTypeId);
      }
    });
    
  }

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

  sourceChange(src){
    this.subsources = [];
    this.filterstrings = [];
    this.isAvailable = false;
    this._commonSvc
    .getSubSourcesBySource(src.sourceUid)
    .subscribe((response) => {
      if (response.code === 6000) {
        response.data.forEach(e => {
        this.dashletsIcons.forEach(d => {  
          this.filterstrings.push(e.name.trim())
          var regex = new RegExp(this.filterstrings.join( "|" ), "i");
            this.isAvailable = regex.test(d.title);
            this.locked = regex.test('Normal Parking');
              e.locked = !this.locked;
            if (this.isAvailable) {
              e.iconName = d.iconName
              let i = this.dashletsIcons.indexOf(d)
              this.dashletsIcons.splice(i,1)
            } 
          });
          response.data.forEach(element => {
            if (!element.iconName){
              element.iconName = 'ri-file-list-fill'
            }
          });
        });
        this.subsources=response.data;
        console.log("this.subsources", this.subsources);
        
        this.subsources = [...this.subsources]
      }
    });
    
  }


  initLogin() {
    return this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  confirm() {
    let p1 = this.applicantForm.get('password').value;
    let p2 = this.applicantForm.get('confirmPassword').value;
    if (p1 !== p2) {
      return Swal.fire("Sorry!", "Password does not match!", "error");
    }
    return ""
  }

  public fetchAllOrganizations(id: any) {
    this._commonSvc
      .fetchAllOrganizations(id)
      .subscribe((response) => {
        if (response.code === 6000) {
          this.organizations = response.data;
         this.organizations.forEach((e) => {
          if (this.code === e.code.replace(/\s/g, "")) {
            localStorage.setItem("organization", JSON.stringify(e));
            this._commonSvc.getSourcesByOrganization(e.uuid).subscribe({
              next: (response) => {
                if (response.code === 6000) {
                  this.sources = response.data;
                 this.sources.forEach((data) => {
                  if (data.name === 'Fine and penality') {
                    let i = this.sources.indexOf(data);
                    this.sources.splice(i, 1);
                    this.sources = [...this.sources]
                  }
                  });
                  this.sourceChange(this.sources[0])
                }
              },
            })
          }
        });
         
         
        }
      });
  }




 
  selectedOption() {
    console.log("On change List", this.selectedValue);
    this.actor = this.selectedValue.name;
    this.applicantTypeId = this.selectedValue.setupUUID
  }

  get f() { return this.loginForm.controls; }
  ngAfterViewInit() { }

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

  goTo(data: any) {
    this.router.navigateByUrl(data);
  }

  openMenu(data: any) {
    this.customerHome = false;
    if (data === 'applications') {
      this.paymentHome = true;
    }
  }

  openEnd(content: TemplateRef<any>, title: string,) {

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

  openEndWithData(content: TemplateRef<any>, title: string, form: any) {
    this.formType = form;
    this.fromTiles = true;
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
          if(this.fromTiles){
            this.data = `${this.formType?.name}+${this.formType?.subSourceUid}`
          }else{
            this.data = "inbox"
          }
          
          this.httpClientSvc.get(`${this.baseUrl}/api/v1/user/user-info`).subscribe({
            next: (response: any) => {
              if (response.code === 6000) {
                 this.router.navigate([`/applicant-landing/${this.data}`]);
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
  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  openNormalParking() {
    const data = {
      title: "Normal Parking",
      label: "save",
      action: "save",
      regions: this.regions

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

    const dialog = this.modal.open(NormalParkingDialogComponent, config);
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




  open(item: any, options: any): void {
  if(options === "REGISTRATION"){
    const data = {
      title: "Applicant Registration",
      label: "save",
      action: "save",
      regions: this.regions

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
  }else{
 this.openEnd(item, options);
}
  }
 

}
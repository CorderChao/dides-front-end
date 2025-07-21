import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import {
  NgbCarouselModule,
  NgbOffcanvas,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { RootReducerState } from "src/app/pages/store";
import Swal from "sweetalert2";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "src/app/modules/service/authentication.service";
import { ToastService } from "../../services/toast.service";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-homepage",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    RouterModule,
  ],
  templateUrl: "./homepage.component.html",
  styleUrl: "./homepage.component.scss",
})
export class HomepageComponent implements OnInit {

 private readonly baseUrl: string = `${environment.BASE_API}:8089`;

  
  title: string | undefined;
  showNavigationArrows: any;
  showNavigationIndicators: any;
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

  showButton: boolean = false;
  code: any;
  resetPass: boolean;
  tokenExpiryTime: string;
  currentUser: any;

  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;

  @ViewChild("filtetcontent") filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();

  constructor(
    private router: Router,
    private httpClientSvc: HttpClient,
    private authenticationSvc: AuthenticationService,
    private toastSvc: ToastService,
    private formBuilder: UntypedFormBuilder,
    private offcanvasService: NgbOffcanvas,
    private store: Store<RootReducerState>
  ) {}

  ngOnInit(): void {}

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

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  get f() {
    return this.loginForm.controls;
  }

  ngAfterViewInit() {}

  public forgotPassword(email) {
    let payload = { email: email };
    this.authenticationSvc.fetchUserByEmail(payload).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.authenticationSvc
            .resetPassword(response.data.uuid)
            .subscribe((response) => {
              if (response.code === 6000) {
                this.resetPass = false;
                this.toastSvc.success(
                  "Information",
                  "Password reset successfully, Check your e-mail to get new Paassword",
                  5000
                );
              }
            });
        }
      },
    });
  }

  public async onSubmit(payload: any) {
    let userName = payload.username;
    let password = payload.password;
    this.authenticationSvc.login(userName, password).subscribe({
      next: (user: any) => {
        if (user) {
          this.tokenExpiryTime = JSON.stringify(user.expires_in);
          localStorage.setItem(
            "currentClient",
            JSON.stringify(user.access_token)
          );
          localStorage.setItem(
            "refreshToken",
            JSON.stringify(user.refresh_token)
          );
          localStorage.setItem("EXPIRE", JSON.stringify(user.refresh_token));
          localStorage.setItem("expireTime", JSON.stringify(user.expires_in));
          this.httpClientSvc
            .get(`${this.baseUrl}/api/v1/user/user-info`)
            .subscribe({
              next: (response: any) => {
                if (response.code === 6000) {
                  this.router.navigate([`/inbox`]);
                  this.currentUser = response.data;
                  localStorage.setItem(
                    "userInfo",
                    JSON.stringify(response.data)
                  );
                  this.offcanvasService.dismiss();
                  this.toastSvc.success(
                    "Hello",
                    "Welcome " +
                      this.currentUser.firstName +
                      " " +
                      this.currentUser.middleName +
                      " " +
                      this.currentUser.lastName,
                    4000
                  );
                } else {
                  Swal.fire("Sorry!", `${response.description}`, "error");
                }
              },
            });
        }
      },
      error: (error) => {
        console.error(error);
        Swal.fire("Sorry!", "Please check your username or password", "error");
      },
    });
  }

  searchUserByEmail(){
    this.loginForm.controls['password'].clearValidators();
    this.loginForm.controls['password'].updateValueAndValidity();
    this.resetPass = true;
  }

}

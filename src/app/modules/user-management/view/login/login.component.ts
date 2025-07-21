import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { FooterComponent } from "src/app/modules/shared/components/footer/footer/footer.component";
import { AuthenticationService } from "../../services/authentication.service";
import { ToastService } from "src/app/modules/shared/services/toast.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, NgbCarouselModule, ReactiveFormsModule, FormsModule, FooterComponent],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = "";
  returnUrl!: string;
  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  tokenExpiryTime: string;

  constructor(
    private toastSVC: ToastService,
    private authenticationSrvc: AuthenticationService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    localStorage.clear();
  }

  initForm = () => {
    this.loginForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      password: ["", Validators.required],
    });
  };

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {  
    let userName = this.loginForm.value.name;
    let password = this.loginForm.value.password;
    this.authenticationSrvc.login(userName, password).subscribe({
      next: (user: any) => { 
    console.log("HERE IAM 1", user);
        this.tokenExpiryTime = JSON.stringify(user.expires_in);
        localStorage.setItem('currentClient',JSON.stringify(user.access_token));
        localStorage.setItem('refreshToken',JSON.stringify(user.refresh_token));
        localStorage.setItem('EXPIRE', JSON.stringify(user.refresh_token));
        localStorage.setItem('expireTime', JSON.stringify(user.expires_in));
        if (user) {
          console.log("HERE IAM 2", user);
          this.getUserInfo();
        }

      },
      error: (error) => {
        console.error(error);
        this.toastSVC.warning(
          "Info!",
          "Unable to login to ReRIMIS",
          5000
        );
      },
    
   });
  }

 getUserInfo(){
  this.authenticationSrvc.userInfo().subscribe(response => {
    console.log("response User INFORMATION", response);
    
    if (response.code === 6000) {     
      localStorage.setItem('organizationUUID', response.data.organization);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      this.getOrganizationInfo(response.data.organization)
    }else{
      this.toastSVC.warning(
        "Info!",
        `${response.description}`,
        5000
      );
    }
  });
 }


 getOrganizationInfo(id: any){
  this.authenticationSrvc.orgInfo(id).subscribe(response => {
     console.log("org", response);
    if (response.code === 6000) {
      console.log("org", response.data);
      localStorage.setItem("logo", response.data.logo);
      localStorage.setItem("orgName", response.data.name);
      this.router.navigate(["/dashboards"]);
    }else{
      this.toastSVC.warning(
        "Info!",
        `${response.description}`,
        5000
      );
    }
  });
 }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}

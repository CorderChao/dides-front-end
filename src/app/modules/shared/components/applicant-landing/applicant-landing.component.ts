import { Component } from "@angular/core";
import {
  NgbCarouselModule,
  NgbModal,
  NgbNavModule,
  NgbToastModule,
} from "@ng-bootstrap/ng-bootstrap";

// Ck Editer
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Sweet Alert
import Swal from "sweetalert2";

// Email Data Get
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { Email } from "../../mailbox/mailbox.model";
import { SharedModule } from "../../shared.module";
import { CreateApplicationComponent } from "../application/create-application/create-application.component";
import { Observable, Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastService } from "src/app/modules/service/toast.service";
import { TableDataRow } from "src/app/modules/data-table/table-data-row";
import { CommonService } from "src/app/modules/service/common.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { ApplicationsFormsComponent } from "../applications-forms/applications-forms.component";
import { PreviewBillComponent } from "../preview-bill/preview-bill.component";
import { ChangeDefaultPasswordComponent } from "src/app/modules/user-management/view/change-default-password/change-default-password.component";
import { EditUserProfileComponent } from "../edit-user-profile/edit-user-profile.component";
import { PreviewApplicationComponent } from "../preview-application/preview-application.component";
import { EditApplicationComponent } from "../edit-application/edit-application.component";
import { environment } from "src/environments/environment.prod";
import { ListBillsComponent } from "../list-bills/list-bills.component";
import { PreviewPaymentsComponent } from "../preview-payments/preview-payments.component";

@Component({
  selector: "app-applicant-landing",
  templateUrl: "./applicant-landing.component.html",
  styleUrl: "./applicant-landing.component.scss",
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbToastModule,
    ScrollToModule,
    NgbCarouselModule,
    NgbNavModule,
    RouterModule,
  ],
})
export class ApplicantLandingComponent {
  public Editor = ClassicEditor;
  userData: any;
  emailData!: Email[];
  emailIds: number[] = [];
  applicationList: any[] = [];
  items: any;
  itemsToSave: any[] = [];
  isShowMenu: boolean = true;
  emailDatas: any;
  dataCount: any;
  masterSelected!: boolean;
  cat: any;
  public CcRecipientsCollapse = true;
  public BccRecipientsCollapse = true;
  setting: any;
  subscription!: Subscription;
  public apply: boolean = false;
  dataPassed: any;
  years: any;
  applications: any[] = [];
  isOpen: boolean = false;
  isRoaming: boolean = false;
  isReserve: boolean = false;
  hasNoDetails: boolean = false;
  isPetrol: boolean = false;
  isFiber: boolean = false;
  isCamps: boolean = false;
  isAdvertise: boolean = false;
  isElectricity: boolean = false;
  isWater: boolean = false;
  isDuct: boolean = false;
  params: any = {
    size: 1,
    page: 0,
    total: 0,
  };
  currentUser: any;
  applicantId: any;
  user: any;
  board: boolean = false;

  application: any;
  action: string;
  streets: any;
  wards: any;
  subsources: any;
  sources: any;
  organizations: any;
  applicationTypeId: any;
  councils: any;
  paymentPlans: any;
  regions: any;
  quantity: number;
  file: any;
  fileSize: string;
  fname: string;
  pdfSource: string;
  filePath: any;
  formType: any;
  subsourceuuid: any;
  isOverTelephone: boolean;
  isGroundTelephone: boolean;
  isKiosk: boolean;
  organization: any;
  organizationName: any;
  isDropdownOpen = false;
  orgCode: any;
  subSourceName: string;
  public readonly baseUrl: string = `${environment.BASE_API}:8086/api/v1`;

  constructor(
    private modal: MatDialog,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private commonSvc: CommonService,
    private toastSvc: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));   
    this.applicantId = this.currentUser?.uuid;
    this.commonSvc.getUserById(this.applicantId).subscribe((response) => {
      if (response.code === 6000) { this.user = response?.data; }});

    //Getting Organizations
    this.commonSvc
      .getComConfigTpyes("ORGANIZATION_TYPE")
      .subscribe((response) => {
        if (response.code === 6000) {
          for (let i = 0; i < response.data?.length; i++) {
            if (response.data[i].name === "INSTITUTION") {
              this.applicationTypeId = response.data[i]?.setupUUID;
            }
          };
        }
      });
  }

  ngOnInit(): void {
     this.fetchData();
  }

  public changePassword(from: string) {
    const data = {
      title: "Change Password",
      label: "Change",
      from: from,
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = "60%";
    config.position = {
      top: "90px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.modal.open(ChangeDefaultPasswordComponent, config);
    dialog.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success(
          "Information",
          `Your new Password was successfully changed, use your new Password to login`,
          6000
        );
      } else if (response.code === 6002) {
        this.toastSvc.warning("Information", `${response.description}`, 6000);
      } else if (response.code === 6005) {
        this.toastSvc.warning("Information", `${response.description}`, 6000);
      } else {
      }
    });
  }

  public editProfile() {
    const data = {
      title: "Edit Profile",
      label: "Update",
      user: this.user
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = false;
    config.width = "60%";
    config.position = {
      top: "90px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.modal.open(EditUserProfileComponent, config);
    dialog.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success(
          "Information",
          `Your  Successfully , Update Profile`,
          6000
        );
      } else if (response.code === 6002) {
        this.toastSvc.warning("Information", `${response.description}`, 6000);
      } else if (response.code === 6005) {
        this.toastSvc.warning("Information", `${response.description}`, 6000);
      } else {
      }
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = true;
    }
  }

  addItem(item: any) {
    console.log("ITEMSSS", item);
    for (let i = 0; i < this.applicationList.length; i++) {
      if (this.applicationList[i].name === item.itemId.name) {
        return Swal.fire(name + " Already Exists", "", "error");
      }
    }

    this.applicationList.push({
      council: item.councilCode,
      subSource: item.subSource.name,
      item: item.itemId,
      region: item.region,
      name:
        item.itemSpecificName !== "" ? item.itemSpecificName : item.quantity,
    });
    console.log("Add Items", this.applicationList);
    return "";
  }

  remove(item: any) {
    const index: number = this.applicationList.indexOf(item);
    if (index !== -1) {
      this.applicationList.splice(index, 1);
    }
  }


renewApplication(applicationId:any){
    let payload = [];
    this.commonSvc
      .renewApplication(applicationId, payload)
      .subscribe((response) => {
      if(response.code === 6000){
          Swal.fire("Information", `${response.description}`, "success");
        }else{
         Swal.fire("Sorry!", `${response.description}`, "error");
        }
      });
  
}

 previewPermit(item:any){
let url = `${this.baseUrl}/application-report/permit/${item.uuid}`
    const link = document.createElement('a');
   link.setAttribute('href', url) ;
    link.setAttribute('download', `permit.pdf`);
    document.body.appendChild(link);
    // link.click();
    window.open(url, '_blank');
  }






  openView(){

  }

  changeOrganization(){

  }

  changeItem(){

  }
  /**
   * Fetches the data
   */
  public fetchData() {
    this.commonSvc.getApplicationsByApplicantId(this.applicantId).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.applications = response.data;
          console.log("applications", this.applications);
        }
      },
    });
  }

  /**
   * Open modal
   * @param content content
   */
  open(content: any) {
    this.modalService.open(content, { size: "lg", centered: true });
  }
  OpenTab() {
    this.apply = true;
  }



  viewApplications() {
    this.apply = false;
  }
  /**
   * on settings button clicked from topbar
   */
  singleData: any = [];
  onSettingsButtonClicked(id: any) {
    this.singleData = this.emailData.filter((order: any) => {
      return order.id === id;
    });
    this.singleData.forEach((item: any) => {
      this.singleData = item;
    });
    document.body.classList.add("email-detail-show");
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove("email-detail-show");
  }


  /**
   * Confirmation mail model
   */
  confirm(content: any) {
    this.modalService.open(content, { centered: true });
    var checkboxes: any = document.getElementsByName("checkAll");
    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    this.emailIds = checkedVal;
  }

  /***
   * Delete Mail
   */
  deleteData() {
    this.emailIds.forEach((item: any) => {
      document.getElementById("chk-" + item)?.remove();
      for (var i = 0; i < this.emailData.length; i++) {
        if (this.emailData[i].id == item) {
          this.emailData[i].category = "trash";
        }
      }
    });
    (
      document.getElementById("email-topbar-actions") as HTMLElement
    ).style.display = "none";
  }

  /***
   * send mail select multiple mail
   */
  selectMail() {
    var checkboxes: any = document.getElementsByName("checkAll");
    var checkedVal: any[] = [];
    var result;
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    this.emailIds = checkedVal;
    this.emailIds.length > 0
      ? ((
          document.getElementById("email-topbar-actions") as HTMLElement
        ).style.display = "block")
      : ((
          document.getElementById("email-topbar-actions") as HTMLElement
        ).style.display = "none");
  }

  /**
   * Show Mail modal
   * @param content modal content
   */
  showMail() {
    const showMail = document.querySelector(
      ".email-wrapper .email-menu-sidebar"
    );
    if (showMail != null) {
      showMail.classList.add("menubar-show");
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    const recentActivity = document.querySelector(
      ".email-wrapper .email-menu-sidebar"
    );
    if (recentActivity != null) {
      recentActivity.classList.remove("menubar-show");
    }
  }

  // Active Star
  activeStar(id: any, i: any) {
    if (this.emailData[i].category != "starred") {
      this.cat = this.emailData[i].category;
      this.emailData[i].category = "starred";
    } else {
      this.emailData[i].category = this.cat;
    }
    document.querySelector(".star_" + id)?.classList.toggle("active");
  }

  /**
   * Category Filtering
   */
  categoryFilter(e: any, name: any) {
    var removeClass = document.querySelectorAll(".mail-list a");
    removeClass.forEach((element: any) => {
      element.classList.remove("active");
    });
    e.target.closest(".mail-list a").classList.add("active");
    if (name == "all") {
      this.emailDatas = this.emailData;
    } else {
      this.emailDatas = this.emailData.filter((email: any) => {
        return email.category === name;
      });
    }
  }

  /**
   * Label Filtering
   */
  labelsFilter(e: any, name: any) {
    var removeClass = document.querySelectorAll(".mail-list a");
    removeClass.forEach((element: any) => {
      element.classList.remove("active");
    });
    e.target.closest(".mail-list a").classList.add("active");
    this.emailDatas = this.emailData.filter((email: any) => {
      return email.label === name;
    });
  }

  /**
   * Chat Filtering
   */
  userName: any;
  profile: any = "user-dummy-img.jpg";
  chatFilter(name: any, image: any) {
    (
      document.getElementById("emailchat-detailElem") as HTMLElement
    ).style.display = "block";
    this.userName = name;
    this.profile = image ? image : "user-dummy-img.jpg";
  }

  // Close Chat
  closeChat() {
    (
      document.getElementById("emailchat-detailElem") as HTMLElement
    ).style.display = "none";
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.emailDatas.forEach(
      (x: { state: any }) => (x.state = ev.target.checked)
    );
    if (ev.target.checked) {
      (
        document.getElementById("email-topbar-actions") as HTMLElement
      ).style.display = "block";
    } else {
      (
        document.getElementById("email-topbar-actions") as HTMLElement
      ).style.display = "none";
    }
  }



  logout() {
    localStorage.clear();
    this.router.navigate([`/customer`]);
  }

  create(name: string) {
    console.log("Create");
    const data = {
      title: `Apply  - ` + name,
      label: "Save",
      action: "create",
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "65%";
    config.position = {
      top: "75px",
    };
    config.backdropClass = "backdropBackground";
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";
    const dialogRef = this.dialog.open(CreateApplicationComponent, config);
    dialogRef.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        // this.toastSvc.success('Information','Financial Year created successfuly', 6000);
        Swal.fire("Congratulations!", `${response.description}`, "success");
        this.fetchData();
        // this.getAllFinancialYears();
      } else if (response.code === 6002) {
        Swal.fire("Sorry!", `${response.description}`, "error");
        // this.toastSvc.warning('Information',`${response.description}`, 6000);
      } else if (response.code === 6004) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      } else if (response.code === 6005) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      } else if (response.code === 6006) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      }
    });
  }

  columns: TableDataRow[] = [
    { header: "No", value: "index" },
    { header: "Application Date", value: "createdDate" },
    { header: "Organization", value: "organization.name" },
    { header: "Application For", value: "items" },
    { header: "Council", value: "street.ward.council.name" },
     { header: "Street", value: "street.streetName" },
    //  { header: "Quantity/Length/Area", value: "itemQuantity" },
    { header: "Status", value: "applicationStatus.name" },

    {
      header: "Actions",
      value: "actions",
      class: "d-flex justify-content-center",
    },
  ];

  update(item: any) {
    console.log("Update Clicked", item);
    const data = {
      title: `Update  - Application`,
      label: "Save",
      action: "update",
      item: item,
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "65%";
    config.position = {
      top: "75px",
    };
    config.backdropClass = "backdropBackground";
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";
    const dialogRef = this.dialog.open(EditApplicationComponent, config);
    dialogRef.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
           this.fetchData();
        Swal.fire("Congratulations!", `${response.description}`, "success");
      } else if (response.code === 6002) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      } else if (response.code === 6004) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      } else if (response.code === 6005) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      } else if (response.code === 6006) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      } else if (response.code === 6010) {
        Swal.fire("Sorry!", `${response.description}`, "error");
      }else{
      }
    });
  }


previewApplication(item:any){
  let name = this.user?.companyName !== '' ? this.user?.companyName :this.user?.firstName+' '+this.user?.middleName+' '+this.user?.lastName;
   console.log("Application", this.user);

    const data = {
      title: `Application Details for `+name,
      label: "Save",
      action: "create",
      application: item,
      user: this.user
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "60%";
    config.position = {
      top: "75px",
    };
    config.backdropClass = "backdropBackground";
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";
    const dialogRef = this.modal.open(PreviewApplicationComponent, config);
    dialogRef.afterClosed().subscribe((response) => {
    if(response.code === 6000){
      this.toastSvc.success('Information','Application Initialized Successfully', 6000);
    } else if(response.code === 6001){
      this.toastSvc.warning('Information',`${response.description}`, 6000);
    }else if(response.code === 6002){
      this.toastSvc.warning('Information',`${response.description}`, 6000);
    }else if(response.code === 6004){
      this.toastSvc.warning('Information',`${response.description}`, 6000);
    }else if(response.code === 6005){
      this.toastSvc.warning('Information',`${response.description}`, 6000);
    }else if(response.code === 6010){
      this.toastSvc.warning('Information',`${response.description}`, 6000);
    }else{

   }

});
        
}

  largeModal(largeDataModal: any, item: any) {
    console.log("Passed Data", item);
    this.application = item;
    this.modalService.open(largeDataModal, { size: "lg", centered: true });
  }




  previewBill(item:any) {
  console.log("Here Iam", item);
    const data = {
      title: "List of Bill for",
      label: "preview bill",
      action: "preview",
      bill: item?.applicationBills,
      name: this.user?.companyName !== '' ? this.user?.companyName :this.user?.firstName+' '+this.user?.middleName+' '+this.user?.lastName
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

    const dialog = this.dialog.open(ListBillsComponent, config);
    dialog.afterClosed().subscribe(() => {
    });
  }


  previewPayments(item:any) {
  console.log("Here Iam", item);
    const data = {
      title: "Preview List of Payments",
      label: "preview payments",
      action: "preview",
      payments: item?.applicationBillPayments
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

    const dialog = this.dialog.open(PreviewPaymentsComponent, config);
    dialog.afterClosed().subscribe(() => {
    });
  }


  openModalFromInside() {
console.log("Iam here");
    const data = {
      title: 'APPLICATION FORM',
      label: "Submit",
      action: "save",
      applicantId: this.applicantId
    };
    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = false;
    config.autoFocus = false;
    config.width = "60%";
    config.position = {
      top: "70px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";
    const dialog = this.dialog.open(ApplicationsFormsComponent, config);
    dialog.afterClosed().subscribe((response) => {
            console.log("Iam HEre after successfully saving", response);
       if(response.code === 6000){
         this.fetchData();
       Swal.fire("Information", `${response.description}`, "success"); 
    } else if(response.code === 6001){
     Swal.fire("Sorry!!", `${response.description}`, "error");
    }else if(response.code === 6002){
        Swal.fire("Sorry!!", `${response.description}`, "error");
    }else if(response.code === 6004){
        Swal.fire("Sorry!!", `${response.description}`, "error");
    }else if(response.code === 6005){
      Swal.fire("Sorry!!", `${response.description}`, "error");
    }else if(response.code === 6010){
        Swal.fire("Sorry!!", `${response.description}`, "error");
    }else{

   }

    });
  }

}

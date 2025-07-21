import { Component } from "@angular/core";
import { UserDetails } from "../../models";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UtilityFunctionsService } from "src/app/modules/shared/services/utility-functions.service";
import { UserManagementService } from "../../user-management.service";
import { TableDataRow } from "src/app/modules/data-table/table-data-row";
import { MenuAction } from "src/app/modules/shared/models/menu-action";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastService } from "src/app/modules/service/toast.service";
import { CommonService } from "src/app/modules/service/common.service";
import { CreateUserComponent } from "../create-user/create-user.component";
import { AssignCollectionSiteComponent } from "./collector-management/assign-collection-site/assign-collection-site.component";
import { ViewCollectorCollectionSiteComponent } from "./collector-management/view-collector-collection-site/view-collector-collection-site.component";
import { CollectorService } from "../../collector.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-users-accounts",
  templateUrl: "./users-accounts.component.html",
  styleUrl: "./users-accounts.component.scss",
})
export class UsersAccountsComponent {
  userTypes: any;
  userTypeId: any;
  currentUser: any;
  organizationId: any;
  employees: any;

  constructor(
    private toastSvc: ToastService,
    private modal: MatDialog,
    private dialog: MatDialog,
    private _commonSvc: CommonService,
    private modalService: NgbModal,
    private utils: UtilityFunctionsService,
    private userSrv: UserManagementService,
    private collectorService: CollectorService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("userInfo"));
    this.organizationId = this.currentUser.organization;
    console.log("Organization Id", this.organizationId);
    this.fetchAllUserType();
  }

  ngOnInit(): void {
    this.fetchAllAgentEmployee(this.organizationId);
  }

  users: UserDetails[] = [];
  isOpen: boolean = false;
  params: any = {
    size: 1,
    page: 0,
    total: 0,
  };

  columns: TableDataRow[] = [
    { header: "No", value: "index" },
    {
      header: "FullName",
      value: "name",
      concat: ["firstName", "middleName", "lastName"],
    },
    { header: "Gender", value: "sex" },
    { header: "Email", value: "email" },
    { header: "Mobile", value: "phoneNumber" },
    {
      header: "UserType",
      value: "userType.name",
    },
    { header: "Status", value: "status" },
    {
      header: "Actions",
      value: "actions",
      class: "d-flex justify-content-center",
    },
  ];

  collectorColumn: TableDataRow[] = [
    { header: "No", value: "index" },
    {
      header: "FullName",
      value: "name",
      concat: ["firstName", "middleName", "lastName"],
    },
    { header: "Gender", value: "sex" },
    { header: "Mobile", value: "phoneNumber" },
    {
      header: "UserType",
      value: "userType.name",
    },
    { header: "Status", value: "status" },
    {
      header: "Actions",
      value: "collectorActions",
      class: "d-flex justify-content-center",
    },
  ];

  public fetchAllUserType() {
    let type = "DESIGNATION_TYPE";
    this._commonSvc.getComConfigTpyes(type).subscribe((response) => {
      console.log("User Types", response);
      if (response.code === 6000) {
        this.userTypes = response.data;
        for (let i = 0; i < this.userTypes.length; i++) {
          if (this.userTypes[i].name === "COLLECTOR") {
            this.userTypeId = this.userTypes[i].setupUUID;
          }
          this.fetchAllCollectors(this.userTypeId, this.organizationId);
        }
      }
    });
  }
  public fetchAllCollectors(userType: any, organizationId: any) {
    this._commonSvc
      .getAgentCollectors(userType, organizationId)
      .subscribe((response) => {
        if (response.code === 6000) {
          this.users = response.data;
        }
        console.log("this.users",  this.users);
        
      });
  }
  public fetchAllAgentEmployee(id: any) {
    this._commonSvc.getAllAgentsEmployee(id).subscribe((response) => {
      console.log("Organizations Employee", response);
      if (response.code === 6000) {
        this.employees = response.data;
      } else {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      }
    });
  }

  assignCollectionSites(collector: any) {
    const data = {
      title: `Assign A Collection Site To ${collector.firstName} ${collector.lastName}`,
      label: "Assign",
      item: collector,
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "60%";
    config.position = {
      top: "80px",
    };
    config.backdropClass = "backdropBackground";
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";
    const dialogRef = this.dialog.open(AssignCollectionSiteComponent, config);
    dialogRef.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success("Information", "Saved successfully", 5000);
      }
    });
  }
  
  remove_collection_site(collector: any) {
    const data = {
      title: `A Collection Site of ${collector.firstName} ${collector.lastName}`,
      label: "Remove",
      item: collector,
    };

    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "60%";
    config.position = {
      top: "80px",
    };
    config.backdropClass = "backdropBackground";
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";
    const dialogRef = this.dialog.open(ViewCollectorCollectionSiteComponent, config);
    dialogRef.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success("Information", "Saved successfully", 5000);
      }
    });
  }

  updateEmployee(item: any) {
    const data = {
      title: "Update Employee",
      label: "Update user",
      action: "update",
      userType: "employee",
      data: item,
    };
    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = false;
    config.autoFocus = false;
    config.width = "55%";
    config.position = {
      top: "70px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.modal.open(CreateUserComponent, config);
    dialog.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success(
          "Information",
          "User Account created successfully",
          5000
        );
        this.fetchAllAgentEmployee(this.organizationId);
      } else if (response.code === 6002) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6004) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6005) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6006) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      }
    });
  }

  createEmployee() {
    const data = {
      title: "Create New Employee",
      label: "create user",
      action: "create",
      userType: "employee",
    };
    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = false;
    config.autoFocus = false;
    config.width = "55%";
    config.position = {
      top: "70px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.modal.open(CreateUserComponent, config);
    dialog.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success(
          "Information",
          "User Account created successfully",
          8000
        );
        this.fetchAllAgentEmployee(this.organizationId);
      } else if (response.code === 6002) {
        this.toastSvc.warning("Information", `${response.description}`, 8000);
      } else if (response.code === 6004) {
        this.toastSvc.warning("Information", `${response.description}`, 8000);
      } else if (response.code === 6005) {
        this.toastSvc.warning("Information", `${response.description}`, 8000);
      } else if (response.code === 6006) {
        this.toastSvc.warning("Information", `${response.description}`, 8000);
      }
    });
  }

  createCollector() {
    const data = {
      title: "Create New Collector",
      label: "create Collector",
      action: "create",
      userType: "collector",
    };
    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = false;
    config.autoFocus = false;
    config.width = "55%";
    config.position = {
      top: "70px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.modal.open(CreateUserComponent, config);
    dialog.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success(
          "Information",
          "User Account created successfully",
          5000
        );
        this.fetchAllCollectors(this.userTypeId, this.organizationId);
      } else if (response.code === 6002) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6004) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6005) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6006) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      }
    });
  }

  updateCollector(item: any) {
    const data = {
      title: "Update New Collector",
      label: "update Collector",
      action: "update",
      userType: "collector",
      data: item,
    };
    const config = new MatDialogConfig();
    config.data = data;
    config.disableClose = false;
    config.autoFocus = false;
    config.width = "55%";
    config.position = {
      top: "70px",
    };
    config.panelClass = "mat-dialog-box";
    config.backdropClass = "mat-dialog-overlay";

    const dialog = this.modal.open(CreateUserComponent, config);
    dialog.afterClosed().subscribe((response) => {
      if (response.code === 6000) {
        this.toastSvc.success(
          "Information",
          "User Account created successfully",
          5000
        );
        this.fetchAllAgentEmployee(this.organizationId);
      } else if (response.code === 6002) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6004) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6005) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      } else if (response.code === 6006) {
        this.toastSvc.warning("Information", `${response.description}`, 5000);
      }
    });
  }

  viewCollectionSite(collector: any){
    this.collectorService.getCollectorCollectionSite(collector.uuid).subscribe({
      next: (response) => {
        let siteDetailsHtml;
        if (response.code === 6000) {
          const site = response.data;
          siteDetailsHtml = `
              <p style="font-size:14px"><strong>Collection Site Assigned: </strong>
              ${site.name}
              </p>
          `;
        } else {
          siteDetailsHtml = `
          '<div><p style="color:red;font-style:italic;font-size:14px">Collector Not Assigned To Collection Site.</p></div>',`;
        }
          Swal.fire({
          title: `${collector.firstName} ${collector.middleName} ${collector.lastName}`,
          html: siteDetailsHtml,
          icon: 'info',
          iconColor: '#1976D2',
          showCancelButton: false,
          confirmButtonColor: '#1976D2',
          confirmButtonText: 'Close',
          customClass: {
            popup: 'assigned-site-popup'
          }
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Collection Site Assigned',
          html: '<div><p style="color:red;font-style:italic">Collector Not Assigned To Collection Site.</p></div>',
          icon: 'info',
          iconColor: '#1976D2',
          showCancelButton: false,
          confirmButtonColor: '#1976D2',
          confirmButtonText: 'Close',
          customClass: {
            popup: 'assigned-site-popup'
          }
        });
      }
    });
  }

  async save(data: UserDetails): Promise<UserDetails[]> {
    const existingIndex = this.users.findIndex((user) => user.id === data.id);

    if (existingIndex !== -1) {
      // If the user already exists, update its properties
      this.users[existingIndex] = { ...this.users[existingIndex], ...data };
    } else {
      // If the user doesn't exist, push it to the array
      this.users.push(data);
    }

    return Promise.resolve([...this.users]);
  }

  delete(data: UserDetails): UserDetails[] {
    const index = this.users.indexOf(data);

    if (index !== -1) {
      this.utils.confirm({
        message: "Are you sure you want to delete this record?",
        showTitle: false,
        accept: () => {
          // Remove the user from the array
          this.users = this.users.filter((user) => user.id !== data.id);
        },
      });

      // Return the updated users array after the confirmation dialog is handled
      return [...this.users];
    } else {
      // If the user is not found, return the original users array
      return [...this.users];
    }
  }
}

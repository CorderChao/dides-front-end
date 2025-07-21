import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserManagementService } from "../../user-management.service";
import { MatStepper } from "@angular/material/stepper";
import { CommonService } from "src/app/modules/service/common.service";
import { AuthenticationService } from "src/app/modules/service/authentication.service";
import { ToastService } from "src/app/modules/service/toast.service";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent implements OnInit {
  public title: string;
  public action: string;
  public label: string;
  public isUpdate: boolean;
  public isLinear: boolean = true;
  public showRegCon: boolean = false;
  public showCon: boolean = false;
  public regions: any[] = [];
  public councils: any[] = [];
  public userTypes: any[] = [];

  public user: any;
  public userform: FormGroup;
  public roleForm: FormGroup;
  public mobileMask = "";

  public sex: any[] = [
    { name: "Male", value: true },
    { name: "Female", value: false },
  ];

  code2: any;
  level: any;
  designationCode: any;

  @ViewChild("stepper", { static: true })
  stepper: MatStepper;
  assignedPermissions: any[] = [];
  assignedPermissionsCodes: any[] = [];
  allPermissions: any[] = [];
  availablePermissions: any[] = [];
  roleId: any[] = [];
  saveUser: any;
  idTypes: any;
  organizations: any;
  councilCode: null;
  regionCode: any;
  userType: any;
  currentUser: any;
  organizationId: any;
  adminlevel: any[] = [];
  idTypesUUID: any;
  adminlevelUUID: any;
  designationUUID: any;

  constructor(
    private toastSVC: ToastService,
    private userSrv: AuthenticationService,
    private _commonSvc: CommonService,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.action = data.action;
    this.label = data.label;
    this.isUpdate = false;
    this.isLinear = true;
    this.userType = data.userType;

    if (this.action === "update") {
      this.user = data.data;
      this.isUpdate = true;
       this.assignedPermissions = this.user.roles
       this.formatNidaOnUpdate(this.user.identificationCardNumber);
    }
   this.currentUser = JSON.parse(localStorage.getItem('userInfo'));
   this.organizationId = this.currentUser?.organization;
   console.log(" this.organizationId",  this.currentUser);
   
  }

  ngOnInit() {
    this.getAllRegions();
    this.getAllRolesPermission();
    this.fetchAllUserType();
    this.fetchAllIdTypes();
    this.getAllAdminlevel();
    this.userform = this.initUserform();
 
  }

  
  formatNida(event: any) {
    const value = event.target.value.replace(/\D/g, ''); 
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue  = value.substring(0, 8);
    }
    if (value.length > 8) {
      formattedValue += '-' + value.substring(8, 13);
    }
    if (value.length > 13) {
      formattedValue += '-' + value.substring(13, 18);
    }
    if (value.length > 18) {
      formattedValue += '-' + value.substring(18, 20);
    }
     this.userform.get('identificationCardNumber').setValue(formattedValue); 
  }

  formatNidaOnUpdate(value: any) {
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue  = value.substring(0, 8);
    }
    if (value.length > 8) {
      formattedValue += '-' + value.substring(8, 13);
    }
    if (value.length > 13) {
      formattedValue += '-' + value.substring(13, 18);
    }
    if (value.length > 18) {
      formattedValue += '-' + value.substring(18, 20);
    }
    this.user.identificationCardNumber = formattedValue; 
  }

  formatPhoneNumber(event: any) {
    const value = event.target.value.replace(/\D/g, "");
    event.target.value = value;
    this.userform.get("phoneNumber").setValue(value);
  }

  public getAllAdminlevel() {
    this._commonSvc.getAllAdminlevel().subscribe((response) => {
      if (response.code === 6000) {
        this.adminlevel = response.data;
        response.data.forEach(element => {
          if(element.name === 'HQ'){
            this.adminlevelUUID = element.setupUUID;
          }
        });
      }
    });
  }
  public fetchAllIdTypes() {
    this._commonSvc.getAllIdTypes().subscribe((response) => {
      if (response.code === 6000) {
        response.data.forEach(element => {
          if(element.name === 'NIDA'){
            this.idTypesUUID = element.setupUUID;
          }
        });
      }
    });
  }

  public fetchAllUserType() {
    let type = "DESIGNATION_TYPE";
    this._commonSvc.getComConfigTpyes(type).subscribe((response) => {
      console.log("User Types", response);
      if (response.code === 6000) {
        this.userTypes = response.data;
        response.data.forEach(element => {
          if(element.name === "COLLECTOR"){
            this.designationUUID = element.setupUUID;
          }
        });
        console.log(" this.designationUUID",  this.designationUUID);
        
      }
      
    });
  }

  getAllRolesPermission() {
    this.userSrv.fetchAllRolesPermissions().subscribe((response) => {
      if (response.code === 6000) {
        this.allPermissions = response.data;
      } else if (response.code === 6004) {
        this.toastSVC.warning("Info!", "No records found", 5000);
      } else if (response.code !== 6000 && response.code !== 6004) {
        this.toastSVC.warning("Error!", "Unable to fetch data", 5000);
      }
    });
  }

  public initUserform(): FormGroup {
    if (this.userType === 'employee') {
      if (this.action === "create") {
        return this.formBuilder.group({
          userLevel: ["", Validators.required],
          userTypeId: ["", Validators.required],
          firstName: ["", Validators.required],
          middleName: [""],
          lastName: ["", Validators.required],
          email: ['', ],
          phoneNumber: [ "", Validators.compose([ Validators.required, Validators.pattern("^[0][0-9]{9}$"),
            ]),
          ],
          sex: ['', Validators.required],
          regionCode: [""],
          councilCode: [""],
          identificationCardNumber: ["", Validators.required],
        });
      } else {
        return this.formBuilder.group({
          userLevel: [this.user.administrativeLevel?.setupUUID, Validators.required],
          userTypeId: [this.user.userType.setupUUID, Validators.required],
          firstName: [this.user.firstName, Validators.required],
          middleName: [this.user.middleName, Validators.required],
          lastName: [this.user.lastName, Validators.required],
          email: [this.user.email,],
          phoneNumber: [this.user.phoneNumber, Validators.compose([Validators.required,Validators.pattern("^[0][0-9]{9}$"),]),],
          sex: [this.user.sex, Validators.required],
          regionCode: [this.user.regionId],
          councilCode: [this.user.councilCode],
          enabled: [this.user.enabled,],
          credentialsNonExpired: [this.user.credentialsNonExpired,],
          accountNonLocked: [this.user.accountNonLocked,],
          accountNonExpired: [this.user.accountNonExpired,],
          identificationCardTypeId: [this.user.identificationCardType.setupUUID, Validators.required],
          identificationCardNumber: [this.user.identificationCardNumber, Validators.required],
        });
      }
    }else{
      if (this.action === "create") {
        return this.formBuilder.group({
          firstName: ["", Validators.required],
          middleName: [""],
          lastName: ["", Validators.required],
          phoneNumber: [ "", Validators.compose([ Validators.required, Validators.pattern("^[0][0-9]{9}$"),
            ]),
          ],
          sex: ['', Validators.required],
          regionCode: [""],
          councilCode: [""],
          identificationCardNumber: ["", Validators.required],
        });
      } else {
        return this.formBuilder.group({
          userLevel: [this.user.administrativeLevel?.setupUUID, Validators.required],
          userTypeId: [this.user.userType.setupUUID, Validators.required],
          firstName: [this.user.firstName, Validators.required],
          middleName: [this.user.middleName, Validators.required],
          lastName: [this.user.lastName, Validators.required],
          phoneNumber: [this.user.phoneNumber, Validators.compose([Validators.required,Validators.pattern("^[0][0-9]{9}$"),]),],
          sex: [this.user.sex, Validators.required],
          regionCode: [this.user?.regionId],
          councilCode: [this.user?.councilCode],
          enabled: [this.user.enabled,],
          credentialsNonExpired: [this.user.credentialsNonExpired,],
          accountNonLocked: [this.user.accountNonLocked,],
          accountNonExpired: [this.user.accountNonExpired,],
          identificationCardTypeId: [this.user.identificationCardType.setupUUID, Validators.required],
          identificationCardNumber: [this.user.identificationCardNumber, Validators.required],
        });
      }
    }
   
  }

  public save() {
    if (this.userType === "employee" && this.action === "create") {
      this.createEmployee();
    } else if (this.userType === "employee" && this.action === "update") {
      this.updateEmployee();
    } else if (this.userType === "collector" && this.action === "create") {
      this.createCollector();
    } else if(this.userType === "collector" && this.action === "update") {
      this.updateCollector();
    }
  }

  createEmployee() {
    let payload = {
      firstName: this.saveUser.firstName,
      middleName: this.saveUser.middleName,
      lastName: this.saveUser.lastName,
      email: this.saveUser.email,
      sex: this.saveUser.sex,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: true,
      phoneNumber: this.saveUser.phoneNumber,
      checkNumber: "",
      councilCode: this.saveUser.councilCode.code,
      regionId: this.saveUser.regionCode.uuid,
      fileNumber: "",
      userTypeId: this.saveUser.userTypeId,
      organizationId: this.organizationId,
      identificationCardTypeId: this.idTypesUUID,
      identificationCardNumber: this.saveUser.identificationCardNumber,
    };
    console.log("paylaod", payload);
    this.userSrv.createUser(payload).subscribe((response) => {
      console.log("Save User Employee", response);
      if (response.code === 6000) {
        for (let i = 0; i < this.assignedPermissions.length; i++) {
          this.roleId.push({ roleId: this.assignedPermissions[i].uuid });
        }
        let role = {
          userId: response.data.uuid,
          roleList: this.roleId,
        };
        console.log("Save User Role", role);
        this.userSrv.saveUserRole(role).subscribe((responsee) => {
          if (responsee.code === 6000) {
            console.log("Save User Employee", responsee);
            this.dialogRef.close(response);
          } else {
            this.toastSVC.warning("Information", `${response.description}`, 6000);
            this.dialogRef.close(response);
          }
        });
      }else{
       this.dialogRef.close(response);
      }
    });
  }
  updateEmployee() {
    let payload =
    {
      "firstName": this.userform.value.firstName,
      "middleName": this.userform.value.middleName,
      "lastName": this.userform.value.lastName,
      "email": this.userform.value.email,
      "sex": this.userform.value.sex,
      "accountNonExpired": this.userform.value.accountNonExpired,
      "accountNonLocked": this.userform.value.accountNonLocked,
      "credentialsNonExpired": this.userform.value.credentialsNonExpired,
      "enabled": this.userform.value.enabled,
      "phoneNumber": this.userform.value.phoneNumber,     
      "councilCode": this.userform.value.councilCode,
      "regionId": this.userform.value.regionCode,
      "userTypeId": this.userform.value.userTypeId,
      "organizationId": this.organizationId,
      "identificationCardTypeId": this.userform.value.identificationCardTypeId,
      "identificationCardNumber":  this.userform.value.identificationCardNumber,
      "administrationLevelId": this.userform.value.userLevel
    }
    console.log("Edit paylaod", payload);
    this.userSrv.updateUser(this.user.uuid, payload).subscribe((response) => {
      console.log("Save User Employee", response);
      if (response.code === 6000) {
        for (let i = 0; i < this.assignedPermissions.length; i++) {
          this.roleId.push({ roleId: this.assignedPermissions[i].uuid });
        }
        let role = {
          userId: response.data.uuid,
          roleList: this.roleId,
        };
        this.userSrv.saveUserRole(role).subscribe((responsee) => {
          if (responsee.code === 6000) {
            console.log("Save User Employee", responsee);
            this.dialogRef.close(response);
          } else {
            this.toastSVC.warning("Information", `${response.description}`, 6000);
            this.dialogRef.close(response);
          }
        });
      }else{
       this.dialogRef.close(response);
      }
    });
  }
  createCollector() {
    if (this.saveUser.userLevel == 1) {
      (this.regionCode = null), (this.councilCode = null);
    } else if (this.saveUser.userLevel == 2) {
      (this.regionCode = this.saveUser.regionCode.uuid),
        (this.councilCode = null);
    }
    let payload = {
      firstName: this.saveUser.firstName,
      middleName: this.saveUser.middleName,
      lastName: this.saveUser.lastName,
      sex: this.saveUser.sex,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: true,
      phoneNumber: this.saveUser.phoneNumber,
      councilCode: "",
      regionId: "",
      organizationId: this.organizationId,
      identificationCardTypeId: this.idTypesUUID,
      identificationCardNumber: this.saveUser.identificationCardNumber,
    };

    console.log("Collector paylaod", payload);

    this.userSrv.createCollector(payload).subscribe((response) => {
      if (response.code === 6000) {
        if (response.code === 6000) {
          for (let i = 0; i < this.assignedPermissions.length; i++) {
            this.roleId.push({ roleId: this.assignedPermissions[i].uuid });
          }
          let role = {
            userId: response.data.uuid,
            roleList: this.roleId,
          };

          console.log("Save User Role", role);

          this.userSrv.saveUserRole(role).subscribe((responsee) => {
            if (responsee.code === 6000) {
              console.log("Save User Employee", responsee);
              this.dialogRef.close(response);
            } else {
              this.toastSVC.info(
                "Information",
                `${response.description}`,
                6000
              );
            }
          });
        }
      } else {
        this.toastSVC.info("Information", `${response.description}`, 6000);
      }
    });
  }
  updateCollector() {
    if (this.saveUser.userLevel == 1) {
      (this.regionCode = null), (this.councilCode = null);
    } else if (this.saveUser.userLevel == 2) {
      (this.regionCode = this.saveUser.regionCode.uuid),
        (this.councilCode = null);
    }
    let payload = {
      firstName: this.saveUser.firstName,
      middleName: this.saveUser.middleName,
      lastName: this.saveUser.lastName,
      sex: this.saveUser.sex,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: true,
      phoneNumber: this.saveUser.phoneNumber,
      councilCode: this.saveUser.councilCode,
      regionId: this.regionCode,
      organizationId: this.organizationId,
      identificationCardTypeId: this.saveUser.identificationCardTypeId,
      identificationCardNumber: this.saveUser.identificationCardNumber,
    };

    console.log("Collector paylaod", payload);

    this.userSrv.updateUser(this.user.uuid, payload).subscribe((response) => {
      if (response.code === 6000) {
        if (response.code === 6000) {
          for (let i = 0; i < this.assignedPermissions.length; i++) {
            this.roleId.push({ roleId: this.assignedPermissions[i].uuid });
          }
          let role = {
            userId: response.data.uuid,
            roleList: this.roleId,
          };

          console.log("Save User Role", role);

          this.userSrv.saveUserRole(role).subscribe((responsee) => {
            if (responsee.code === 6000) {
              console.log("Save User Employee", responsee);
              this.dialogRef.close(response);
            } else {
              this.toastSVC.info(
                "Information",
                `${response.description}`,
                6000
              );
            }
          });
        }
      } else {
        this.toastSVC.info("Information", `${response.description}`, 6000);
      }
    });
  }

  getAllRegions() {
    this._commonSvc.getAllRegions().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.regions = response.data;
          console.log("regionsss", this.regions);
        } 
    }});
  }

  onRegionChange(event: any) {
    this._commonSvc.getCouncilByRegionCode(event.value.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
          console.log("councilsss", this.councils);
        } else if (response.code === 6004) {
          this.councils = [];
          this.toastSVC.warning("Info!", "No records found", 5000);
        } else if (response.code !== 6000 && response.code !== 6004) {
          this.toastSVC.warning("Error!", "Unable to fetch data", 5000);
          this.councils = [];
        }
      },
      error: (error) => {
        console.error(error);
        this.toastSVC.warning(
          "Info!",
          "Service is Temporarily Unavailble",
          5000
        );
      },
    });
  }

  checkLevel(value: any) {
    if (value === "HQ") {
      this.showRegCon = false;
      this.showCon = false;
      this.userform.patchValue({ regionCode: "" })
      this.userform.patchValue({ councilCode: "" })
      this.userform.controls['regionCode'].clearValidators();
      this.userform.controls['regionCode'].updateValueAndValidity();
      this.userform.controls['councilCode'].clearValidators();
      this.userform.controls['councilCode'].updateValueAndValidity();
    } else if (value === "REGION") {
      this.showRegCon = true;
      this.showCon = false;
      this.userform.patchValue({ councilCode: "" })
      this.userform.controls['regionCode'].setValidators([Validators.required]);
      this.userform.controls['regionCode'].updateValueAndValidity();
      this.userform.controls['councilCode'].clearValidators();
      this.userform.controls['councilCode'].updateValueAndValidity();
    }
    else {
      this.showRegCon = true;
      this.showCon = true;
      this.userform.controls['councilCode'].setValidators([Validators.required]);
      this.userform.controls['councilCode'].updateValueAndValidity();
      this.userform.controls['regionCode'].setValidators([Validators.required]);
      this.userform.controls['regionCode'].updateValueAndValidity();
    }
  }


  public fetchAll() {
    //  this.commonApiSvc.getAllDesignation().subscribe((response) => {
    //    if (response.code === 6000) {
    //     this.userTypes = response.data
    //    } else if(response.code === 6004){
    //      this.toastSVC.info(
    //        'Information',
    //        'Sorry, No Records found',
    //        6000
    //      );
    //    }
    //  }, (error) => {
    //    console.error(error);
    //    this.toastSVC.warning('Info','Service is Temporarily Unavailble', 5000);
    //  });
  }

  toggleStatus(user: any) {
    if (user.enabled === true) {
      user.enabled = false;
    } else if (user.enabled === false) {
      user.enabled = true;
    }
  }

  toggleStatus2(user: any) {
    if (user.credentialsNonExpired === true) {
      user.credentialsNonExpired = false;
    } else if (user.credentialsNonExpired === false) {
      user.credentialsNonExpired = true;
    }
  }

  toggleStatus3(user: any) {
    if (user.accountNonLocked === true) {
      user.accountNonLocked = false;
    } else if (user.accountNonLocked === false) {
      user.accountNonLocked = true;
    }
  }

  toggleStatus4(user: any) {
    if (user.accountNonExpired === true) {
      user.accountNonExpired = false;
    } else if (user.accountNonExpired === false) {
      user.accountNonExpired = true;
    }
  }



  public fetchAllRegions() {
    this._commonSvc.getAllRegions().subscribe(
      (response) => {
        if (response.code === 6000) {
          this.regions = response.data;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper, values: any) {
    console.log("Values submitted", values);
    this.saveUser = values;
    stepper.next();
  }

  public roleFormInit(): FormGroup {
    if (this.action === "create") {
      return this.formBuilder.group({
        name: ["", Validators.required],
      });
    } else {
      return this.formBuilder.group({
        name: ["", Validators.required],
      });
    }
  }

  public toggle2(item: any) {
    console.log("Selected");
    const index: number = this.allPermissions.indexOf(item);
    if (index !== -1) {
      this.allPermissions.splice(index, 1);
      this.assignedPermissions.push(item);
      this.allPermissions = [...this.allPermissions];
      this.assignedPermissions = [...this.assignedPermissions];
    }
    console.log("Selected Permission",this.assignedPermissions);
  }

  public toggle(item: any) {
    const index: number = this.assignedPermissions.indexOf(item);
    if (index !== -1) {
      this.assignedPermissions.splice(index, 1);
      this.allPermissions.push(item);
      this.allPermissions = [...this.availablePermissions];
      this.assignedPermissions = [...this.assignedPermissions];
    }
  }

  // public toggle3(item: any) {
  //   if (this.action === "create") {
  //     const index: number = this.assignedPermissions.indexOf(item);
  //     if (index !== -1) {
  //       this.assignedPermissions.splice(index, 1);
  //       this.allPermissions.push(item);
  //       this.allPermissions = [...this.allPermissions];
  //       this.assignedPermissions = [...this.assignedPermissions];
  //     }
  //   } else if (this.action === "update") {
  //     const index: number = this.assignedPermissions.indexOf(item);
  //     if (index !== -1) {
  //       this.assignedPermissions.splice(index, 1);
  //       this.availablePermissions.push(item);
  //       this.availablePermissions = [...this.availablePermissions];
  //       this.assignedPermissions = [...this.assignedPermissions];
  //     }
  //   }
  // }

  public fetchAllPermissions() {
    // this.commonApiSvc.getGrmCategories().subscribe((response) => {
    //   console.log('GRM Category', response.data);
    //   if (response.code === 6000) {
    //      this.allPermissions = response.data;
    //      this.availablePermissions = response.data;
    //     this.assignedPermissions.forEach(item => { //
    //       this.availablePermissions.forEach(data => { //
    //         if (data.code === item.code) {
    //           let index = this.availablePermissions.indexOf(data);
    //           this.availablePermissions.splice(index, 1);
    //           this.availablePermissions = [...this.availablePermissions];
    //         }
    //       });
    //     });
    //   } else if(response.code === 6004){
    //     this.toastSVC.info(
    //       'Information',
    //       'Sorry, No Records found',
    //       6000
    //     );
    //   }
    // }, (error) => {
    //   console.error(error);
    //   this.toastSVC.warning('Info','Service is Temporarily Unavailble', 5000);
    // });
  }
}

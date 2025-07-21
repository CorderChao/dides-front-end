import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { CommonService } from "src/app/modules/service/common.service";
import { ToastService } from "src/app/modules/service/toast.service";
import Swal from "sweetalert2";
import { TermsComponent } from "../terms/terms.component";

@Component({
  selector: "app-applications-forms",
  templateUrl: "./applications-forms.component.html",
  styleUrl: "./applications-forms.component.scss",
})
export class ApplicationsFormsComponent {
  applicationForm: FormGroup;
  insideApplicationForm: FormGroup;
  public title: string;
  public label: string;
  public action: string;
  subsourceuuid: any;
  subsource: any;
  applicationList: any[] = [];
  itemsToSave: any[] = [];
  roadList: any[] = [];
  utilityRoads: any[] = [];
  items: any[] = [];
  pdfSource: any;
  fname: any;
  applicantId: any;
  organizations: any;
  regions: any;
  paymentPlans: any;
  councils: any;
  wards: any;
  streets: any;
  isLength: boolean = true;
  isQuantity: boolean = false;
  isRoaming: boolean = false;
  isReserve: boolean = false;
  acceptedTerms: boolean = false;
  dissolve: boolean = false;
  sourceName: any;

  isFiber: boolean;
  isCamps: boolean;
  isAdvertise: boolean;
  sources: any[]=[];
  subsources: any[]= [];
  filePath: any;
  fileSize: string;
  file: any;
  organizationClicked: any;
  public roads: any[];
  subSourceName: any;
  organizationTypes: any[] = [];
  organizationTypeId: any;
  organizationId: any;
  subSourceId: any;
  logoName: any;

  constructor(
    private toastSvc: ToastService,
    private _commonSvc: CommonService,
    private form: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ApplicationsFormsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    // this.organizations = JSON.parse(localStorage.getItem("organization"));
    this.getOrganizationTypeId();
    console.log("Passed Dataaaa", data);
    this.title = data.title;
    this.label = data.label;
    this.action = data.action;
    this.applicantId = data.applicantId;
  }

  ngOnInit() {
    this.getAllRegions();
    this.getAllRoads();

    this.applicationForm = this.initForm();
    this.insideApplicationForm = this.initForm();
  }

  getOrganizationTypeId() {
    this._commonSvc
      .getComConfigTpyes("ORGANIZATION_TYPE")
      .subscribe((response) => {
        if (response.code === 6000) {
          this.organizationTypes = response.data;

          for (let i = 0; i < this.organizationTypes.length; i++) {
            if (this.organizationTypes[i].name === "INSTITUTION") {
              this.organizationTypeId = this.organizationTypes[i].setupUUID;
            }
          }
          this.fetchAllOrganizations();
        }
      });
  }

  public fetchAllOrganizations() {
    console.log("OrganizationsTypeId", this.organizationTypeId);
    this._commonSvc
      .fetchAllOrganizations(this.organizationTypeId)
      .subscribe((response) => {
        console.log("Organizations", response);
        if (response.code === 6000) {
          this.organizations = response.data;
        }
      });
  }

  openTerms() {
    const data = {
      title: "Terms and Conditions",
      label: "Terms and Conditions",
      action: "preview",
      subSourceId: this.subSourceId,
      logo: this.logoName
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
    const dialog = this.dialog.open(TermsComponent, config);
    dialog.afterClosed().subscribe(() => {
    });

  }


  accepted() {
   if(!this.acceptedTerms){
  this.acceptedTerms = true;
}else{
this.acceptedTerms = false;
}
  
  }

  notAccepted() {
    this.acceptedTerms = false;
    this.dialogRef.close();
  }

  public getSubsource(item) {
   this.subSourceId = item.subSourceUid;
    console.log("Sub-Sourcessssssss Heeeeereeeeee", item);
    if (item.name === "Roaming" || item === "Roaming") {
      this.isRoaming = true;
      this.isReserve = false;
      this.isCamps = false;
      this.isAdvertise = false;
      this.isFiber = false;
    } else if (item.name === "Reserve parking" || item === "Reserve parking") {
      this.isReserve = true;
      this.isRoaming = false;
      this.isCamps = false;
      this.isAdvertise = false;
      this.isFiber = false;
    } else if (item.name === "Camps and place" || item === "Camps and place") {
      this.isCamps = true;
      this.isRoaming = false;
      this.isReserve = false;
      this.isAdvertise = false;
      this.isFiber = false;
    } else if (item.name === "Advertisement" || item === "Advertisement") {
      this.isAdvertise = true;
      this.isRoaming = false;
      this.isReserve = false;
      this.isCamps = false;
      this.isFiber = false;
    }

    this.getAllPaymentPlans(item.subSourceUid, this.organizationId);
    this.getItems(item.subSourceUid);
    this.dissolve = true;
  }

  getItems(subSourceId: any) {
    this._commonSvc.getItemBySubSource(subSourceId).subscribe((response) => {
      if (response.code === 6000) {
        this.items = response.data;
        console.log("Items", this.items);
      }
    });
  }

  private initForm(): FormGroup {
    return this.form.group({
      source: ["", Validators.required],
      subSource: ["", Validators.required],
      itemId: [""],
      region: ["", Validators.required],
      councilCode: [""],
      wardCode: [""],
      streetCode: [""],
      itemQuantity: [""],
      organizationId: ["", Validators.required],
      paymentPlanId: [""],
      itemSpecificName: [""],
      durationQuantity: [""],
      width: [""],
      height: [""],
      area: [""],
      length: [""],
      weight: [""],
      spacing: [""],
      shape: [""],
      color: [""],
      texture: [""],
      maintenance: [""],
      latitude: [""],
      longitude: [""],
      roadId: [""],
      streetCode1: [""],
      attachment: [""],
    });
  }
  getAllRegions() {
    this._commonSvc.getAllRegions().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.regions = response.data;
          console.log("regionsss", this.regions);
        }
      },
    });
  }

  getAllRoads() {
    this._commonSvc.getAllRoads().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.roads = response.data;
          console.log("Roads", this.regions);
        }
      },
    });
  }

  onRegionChange(region: any) {
    this._commonSvc.getCouncilByRegionCode(region.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
          console.log("councilsss", this.councils);
        }
      },
    });
  }
  onChangeCouncil(item: any) {
    this._commonSvc.getWardByCouncilCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.wards = response.data;
          console.log("wards", this.wards);
        }
      },
    });
  }
  onChangeWard(item: any) {
    this._commonSvc.getStreetByWardCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.streets = response.data;
          console.log("streets", this.streets);
        }
      },
    });
  }
  public getAllPaymentPlans(id: any, orgId: any) {
    this.paymentPlans = null;
    this._commonSvc.getPaymentPlanBySubSourceOrganization(id, orgId).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.paymentPlans = response.data;
          console.log("Payment Plans", this.paymentPlans);
        }
      },
    });
  }

  changeOrganization(organization: any) {
    this.organizationId=organization.uuid;
    this.logoName = organization.logo;
    this._commonSvc.getSourcesByOrganization(this.organizationId).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          console.log("Payment Plans", this.regions);
         for(let i=0; i<response.data.length; i++){
            if(response.data[i].gfs.code !== "140245"){
            this.sources.push(response.data[i])
}

}
        }
      },
    });
  }
  public onSourceChange(item: any) {
    if (item.name === "Road user charges") {
      //this.applicationForm.setValue({durationQuantity:1});
      this.isFiber = true;
      this.isRoaming = false;
      this.isReserve = false;
      this.isCamps = false;
      this.isAdvertise = false;
    }

    this._commonSvc
      .getSubSourcesBySource(item.sourceUid)
      .subscribe((response) => {
        console.log("Sub-Sources", response);
        if (response.code === 6000) {
         for(let i=0; i<response.data.length; i++){
            if(response.data[i].name !== "Normal parking"){
            this.subsources.push(response.data[i])
}

}
        }
      });
  }

  onItemChange(item: any) {
    console.log("Itemmmmmssss", item);

    if (item.name === "Telephone overhead") {
      this.isLength = false;
      this.isQuantity = true;
    } else {
      this.isQuantity = false;
      this.isLength = true;
    }
  }

  addRoad() {
    let road = this.insideApplicationForm.get("roadId").value;
    let street = this.insideApplicationForm.get("streetCode1").value;
    for (let i = 0; i < this.roadList.length; i++) {
      if (this.roadList[i].road === road) {
        return Swal.fire(road + " Already Exists", "", "error");
      }
    }
    this.roadList.push({
      road: road,
      streetCode: street,
    });

    console.log("Add Plate no", this.roadList);
    this.insideApplicationForm.get("roadId").reset();
    this.insideApplicationForm.get("streetCode1").reset();
    return "";
  }
  removeRoad(item: any) {
    const index: number = this.roadList.indexOf(item);
    if (index !== -1) {
      this.roadList.splice(index, 1);
    }
  }

  addItem() {
    let plateNo = this.insideApplicationForm.get("itemSpecificName").value;
    for (let i = 0; i < this.applicationList.length; i++) {
      if (this.applicationList[i].name === plateNo) {
        return Swal.fire(plateNo + " Already Exists", "", "error");
      }
    }
    this.applicationList.push({ name: plateNo });
    console.log("Add Plate no", this.applicationList);
    this.insideApplicationForm.get("itemSpecificName").reset();
    return "";
  }

  remove(item: any) {
    const index: number = this.applicationList.indexOf(item);
    if (index !== -1) {
      this.applicationList.splice(index, 1);
    }
  }

  addFile(event) {
    this.file = <File>event.target.files[0];
    this.fname = event.target.files[0].name;
    //type: "application/pdf"
    if (this.file.type !== "application/pdf") {
      return Swal.fire("Please Attach PDF report only", "", "error");
    }
    this.fileSize =
      "File Size : " + parseFloat((this.file.size / 1000000).toFixed(5)) + "MB";

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.filePath = reader.result.toString().split(",")[1];
        this.applicationForm.controls["attachment"].setValidators(null);
        this.applicationForm.controls["attachment"].updateValueAndValidity();
        this.pdfSource = `${this.filePath}`;
      };
    }
    return "";
  }

  public save(item: any) {
    console.log("iteemssssss", item);
    console.log("ROAMING", this.isRoaming);
    let count = this.applicationList.length;
    console.log("count", count);
    if (this.isRoaming) {
      for (let i = 0; i < this.applicationList.length; i++) {
        this.itemsToSave.push({
          itemUuid: this.items[0].itemUid,
          itemSpecification: {
            itemSpecificName: this.applicationList[i].name,
            width: 0,
            height: 0,
            length: 0,
            area: 0,
            weight: 0,
            spacing: "",
            shape: "",
            color: "",
            texture: "",
            maintenance: "",
          },
        });
      }
    } else if (this.isReserve) {
      let item = this.items[0].itemUid;
      this.itemsToSave = [
        {
          itemUuid: item,
          itemSpecification: {},
        },
      ];
    } else {
      this.itemsToSave = [
        {
          itemUuid: item.itemId.itemUid,
          itemSpecification: {
            itemSpecificName: item.itemSpecificName,
            width: item.width,
            height: item.height,
            length: item.length,
            area: item.area,
            weight: item.weight,
            spacing: item.spacing,
            shape: item.spacing,
            color: item.color,
            texture: item.texture,
            maintenance: item.maintenance,
          },
        },
      ];
    }

    for (let i = 0; i < this.roadList.length; i++) {
      this.utilityRoads.push({
        utilityRoads: [
          {
            code: this.roadList[i].streetCode.streetCode,
            name: this.roadList[i].road,
          },
        ],
        streetCode: this.roadList[i].streetCode.streetCode,
      });
    }

    let payload = {
      applicantId: this.applicantId,
      items: this.itemsToSave,
      streetCode: item.streetCode,
      councilCode: item.councilCode.code,
      applicationTypeId: "",
      latitude: 0,
      longitude: 0,
      itemQuantity: item.itemQuantity !== "" ? item.itemQuantity : 1,
      durationQuantity:
        item.durationQuantity !== "" ? item.durationQuantity : 1,
      roadId: item.roadId,
      organization: this.organizationId,
      subSourceUuid: item.subSource.subSourceUid,
      paymentPlanId: item.paymentPlanId,
      fileAttachments: [
        {
          fileName: this.fname === undefined ? "" : this.fname,
          base64String: this.pdfSource === undefined ? "" : this.pdfSource,
        },
      ],
      utilityStreetRoads: this.utilityRoads,
    };

    console.log("Application Payload", payload);

    this._commonSvc.saveApplication(payload).subscribe({
      next: (response) => {
        console.log("Application Response", response);
        if (response.code === 6000) {
          this.dialogRef.close(response);
          // Swal.fire("Information", `${response.description}`, "success");
        } else {
          this.dialogRef.close(response);
          // Swal.fire("Sorry!!", `${response.description}`, "error");
        }
      },
    });
    this.applicationForm.reset();
    this.applicationList = [];
  }
}

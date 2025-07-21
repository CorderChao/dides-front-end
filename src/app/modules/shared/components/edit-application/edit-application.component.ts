import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CommonService } from "src/app/modules/service/common.service";
import { ToastService } from "src/app/modules/service/toast.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-application',
  templateUrl: './edit-application.component.html',
  styleUrl: './edit-application.component.scss'
})
export class EditApplicationComponent {
applicationForm: FormGroup;
  insideApplicationForm: FormGroup;
  public title: string;
  public label: string;
  public action: string;
  subsourceuuid: any;
selectedOption: any;
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
  dissolve: boolean = true;
  sourceName: any;

  isFiber: boolean;
  isCamps: boolean;
  isAdvertise: boolean;
  sources: any;
  subsources: any;
  filePath: any;
  fileSize: string;
  file: any;
  organizationClicked: any;
  public roads: any[];
  subSourceName: any;
  organizationTypes: any[] = [];
  organizationTypeId: any;
  organizationId: any;
  application: any;
  applicationId: any;
  subSourceId: any;
  region: any;

  constructor(
    private toastSvc: ToastService,
    private _commonSvc: CommonService,
    private form: FormBuilder,
    private dialogRef: MatDialogRef<EditApplicationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    // this.organizations = JSON.parse(localStorage.getItem("organization"));
    console.log("Passed Application Dataaaa", data.item);
    this.application = data.item;
    this.applicationId = this.application.uuid;
    this.organizationId = this.application?.organization?.uuid;
    this.region = this.application.street.ward.council.region.name;
   console.log("Application REGION", this.region);
    this.getSubsource(this.application.items[0].subSource.name);
     for(let i=0; i<this.application?.utilityStreet?.length; i++){
    this.roadList.push({
      road: this.application.utilityStreet[i]?.roads[0]?.name,
      streetCode: this.application.utilityStreet[i]?.street,
    });
}
    // this.getOrganizationTypeId();

    this.title = data.title;
    this.label = data.label;
    this.action = data.action;
    this.applicantId = this.application.applicant.uuid;
  }

  ngOnInit() {
    this.getAllRegions();
    // this.getAllRoads();

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
    console.log("CLicked");
    this.dialogRef.close();
  }
  accepted() {
    this.acceptedTerms = true;
    this.dissolve = false;
  }

  notAccepted() {
    this.acceptedTerms = false;
    this.dialogRef.close();
  }

  public getSubsource(item) {
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
    }else{
      this.isFiber = true;
      this.isRoaming = false;
      this.isReserve = false;
      this.isCamps = false;
      this.isAdvertise = false;
    }
    this.subSourceId = this.application?.items[0]?.subSource?.subSourceUid;
    this.getAllPaymentPlans(this.subSourceId, this.organizationId);
    this.getItems(this.subSourceId);
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
    console.log("ItemId", this.application?.items[0]?.itemUid);
    return this.form.group({
      source: [this.application?.items[0]?.subSource?.source,],
      subSource: [this.application?.subSource,],
      itemId: [this.application?.items[0]?.itemUid,],
      region: [this.region, Validators.required],
      councilCode: [this.application?.councilCode?.code,],
      wardCode: [this.application?.street?.ward?.code,],
      streetCode: [this.application?.street?.code,Validators.required],
      itemQuantity: [this.application.itemQuantity,],
      organizationId: [this.organizationId,],
      paymentPlanId: [this.application.itemQuantity, Validators.required],
      itemSpecificName: [this.application?.itemSpecifications[0]?.itemSpecificName,],
      durationQuantity: [this.application.durationQuantity,],
      width: [this.application?.itemSpecifications[0]?.width,],
      height: [this.application?.itemSpecifications[0]?.height,],
      area: [this.application?.itemSpecifications[0]?.area,],
      length: [this.application?.itemSpecifications[0]?.length,],
      weight: [this.application?.itemSpecifications[0]?.weight,],
      spacing: [this.application?.itemSpecifications[0]?.spacing,],
      shape: [this.application?.itemSpecifications[0]?.shape,],
      color: [this.application?.itemSpecifications[0]?.color,],
      texture: [this.application?.itemSpecifications[0]?.texture,],
      maintenance: [this.application?.itemSpecifications[0]?.maintenance,],
      roadId: [this.application?.roadId,],
      streetCode1: [this.application?.street.name,],
      attachment: ["",],
      comment: [this.application?.rmComment,], 
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

  changeOrganization(id: any) {
    this.organizationId=id;
    this._commonSvc.getSourcesByOrganization(id).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.sources = response.data;
          console.log("Payment Plans", this.regions);
        }
      },
    });
  }
  public onSourceChange(item: any) {
    if (item.name === "Road user charges") {
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
          this.subsources = response.data;
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
      subSourceUuid: this.subSourceId,
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

    this._commonSvc.rollbackApplication(this.applicationId, payload).subscribe({
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

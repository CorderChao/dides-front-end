import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonService } from "src/app/modules/service/common.service";
import { SharedModule } from "../../../shared.module";
import { CommonModule } from "@angular/common";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-create-application",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    RouterModule,
  ],
  templateUrl: "./create-application.component.html",

  styleUrl: "./create-application.component.scss",
})
export class CreateApplicationComponent {
  financialYear: any;
  year: any;
  organizations: any;
  regions: any;
  sources: any;
  subsources: any;
  councils: any;
  streets: any;
  wards: any;
  applicationTypeId: any;
  applicantId: any;
  orgTypes: any;
  currentUser: any;
  items: any;
  paymentPlans: any;
  application: any;
  submitForm() {
    throw new Error("Method not implemented.");
  }
  public title: string;
  public label: string;
  public action: string;
  public setting: any;
  public applicationForm: FormGroup;
  showTeam: boolean = false;
  public yearRange: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private commonSvc: CommonService,
    private dialogRef: MatDialogRef<CreateApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
console.log("Passed Data", data.item);
    this.title = data.title;
    this.label = data.label;
    this.action = data.action;
    if (this.action === "update") {
      this.application = data.item;
    }
//Getting applicant Id
   this.currentUser = JSON.parse(localStorage.getItem('userInfo'));
   this.applicantId = this.currentUser?.data.uuid;
   console.log("Logged in User", this.applicantId);

//Getting Organizations
    this.commonSvc
      .getComConfigTpyes("ORGANIZATION_TYPE")
      .subscribe((response) => {
        if (response.code === 6000) {
          console.log("OrganizationType", response.data);
          for (let i = 0; i < response.data?.length; i++) {
            if (response.data[i].name === "AGENCY") {
              this.applicationTypeId = response.data[i]?.setupUUID;
            }
          }
console.log("ApplicationTypeId",this.applicationTypeId);
   this.fetchAllOrganizations();
        }
      });
  }

  ngOnInit() {
    this.getAllRegions();
    this.fetchAllSources();
    this.getAllPaymentPlans();
    this.applicationForm = this.initForm();
    //this.populateYearRange(2023, 2050);
  }

  // populateYearRange(startYear: number, endYear: number): void {
  //   for (let year = startYear; year <= endYear; year++) {
  //     this.yearRange.push(`${year}/${year + 1}`);
  //   }
  //     console.log(this.yearRange);
  // }

  private initForm(): FormGroup {
    if (this.action === "create") {
      return this.formBuilder.group({
        source: ["", Validators.required],
        subSource: ["", Validators.required],
        itemId: ["", Validators.required],
        regionId: ["", Validators.required],
        councilCode: ["", Validators.required],
        wardCode: ["", Validators.required],
        streetCode: ["", Validators.required],
        // applicationTypeId: ["", Validators.required],
        quantity: ["", Validators.required],
        organizationId: ["", Validators.required],
        paymentPlanId: ["", Validators.required],
      });
    } else {
      return this.formBuilder.group({
        source: [this.application.itemId.subSource.source, Validators.required],
        subSource: [this.application.itemId.subSource.subSourceUid, Validators.required],
        itemId: [this.application.itemId.itemUid, Validators.required],
        regionId: ["", Validators.required],
        councilCode: ["", Validators.required],
        wardCode: ["", Validators.required],
        streetCode: ["", Validators.required],
        // applicationTypeId: ["", Validators.required],
        quantity: [this.application.quantity, Validators.required],
        organizationId: [this.application.organizationId.setupUUID, Validators.required],
        paymentPlanId: ["", Validators.required],
      });
    }
  }

  getAllRegions() {
    this.commonSvc.getAllRegions().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.regions = response.data;
          console.log("regionsss", this.regions);
        }
      },
    });
  }

  public getAllPaymentPlans() {
    this.commonSvc.getPaymentPlans().subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.paymentPlans = response.data;
          console.log("regionsss", this.regions);
        }
      },
    });
  }
  onRegionChange(region: any) {
    this.commonSvc.getCouncilByRegionCode(region.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
          console.log("councilsss", this.councils);
        }
      },
    });
  }

  public fetchAllOrganizations() {
    this.commonSvc
      .fetchAllOrganizations(this.applicationTypeId)
      .subscribe((response) => {
        console.log("Organizations", response);
        if (response.code === 6000) {
          this.organizations = response.data;
        }
      });
  }
  public fetchAllSources() {
    this.commonSvc.getSources().subscribe((response) => {
      console.log("Sources", response);
      if (response.code === 6000) {
        this.sources = response.data;
      }
    });
  }
  public onSourceChange(item: any) {
    this.commonSvc
      .getSubSourcesBySource(item.sourceUid)
      .subscribe((response) => {
        console.log("Sub-Sources", response);
        if (response.code === 6000) {
          this.subsources = response.data;
        }
      });
  }
  public onSubSourceChange(item: any) {
    this.commonSvc
      .getItemBySubSource(item.subSourceUid)
      .subscribe((response) => {
        console.log("Sub-Sources", response);
        if (response.code === 6000) {
          this.items = response.data;
        }
      });
  }
  onChangeCouncil(item: any) {
    this.commonSvc.getWardByCouncilCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.wards = response.data;
          console.log("wards", this.wards);
        }
      },
    });
  }
  onChangeWard(item: any) {
    this.commonSvc.getStreetByWardCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.streets = response.data;
          console.log("streets", this.streets);
        }
      },
    });
  }

  public save(data: any) {
    console.log("", data);
    if (this.action === "create") {
      this.create(data);
    } else {
      this.update(data);
    }
  }

  public create(item: any) {
    let payload = {
      applicantId: this.applicantId,
      items: [
    {
      itemUuid: item.itemId,
      itemSpecification: {
        itemSpecificName: "",
        width: "",
        height: "",
        length: "",
        weight: "",
        spacing: "",
        shape: "",
        color: "",
        texture: "",
        maintenance: ""
      }
    }
  ],
      itemId: item.itemId,
      streetCode: item.streetCode,
      applicationTypeId: "",
      latitude: 0,
      longitude: 0,
      quantity: item.quantity,
      roadId: "",
      organization: item.organizationId,
      paymentPlanId: item.paymentPlanId
    };

    console.log("Application Payload", payload);

    this.commonSvc.saveApplication(payload).subscribe({
      next: (response) => {
        console.log("Application Response", response);
        if (response.code === 6000) {
             this.dialogRef.close(response);
        }else{
          this.dialogRef.close(response);
        }
      },
    });
  }

  public update(data: any) {
    //     let yearStart = moment(data.yearStart).format("YYYY-MM-DD");
    //    let yearEnd = moment(data.yearEnd).format("YYYY-MM-DD");
    //   let payload = {
    //             financialYearLabel: data.financialYearLabel,
    //             yearStart: yearStart,
    //             yearEnd: yearEnd
    //           }
    // console.log("Edit Financial Year Payload", payload);
    //     this.setSvc.updateFinancialYear(this.year.financialYearUid, payload).subscribe({
    //       next: (response) => {
    //         console.log("Financial Year", response);
    //         if (response.code === 6000) {
    //              this.dialogRef.close(response);
    //         }else{
    //           this.dialogRef.close(response);
    //         }
    //       },
    //     });
  }
}

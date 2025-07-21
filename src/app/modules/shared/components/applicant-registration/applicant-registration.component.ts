import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/modules/service/common.service';
import Swal from 'sweetalert2';
import { SharedModule } from '../../shared.module';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-applicant-registration',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    RouterModule,
  ],
  templateUrl: './applicant-registration.component.html',
  styleUrl: './applicant-registration.component.scss'
})
export class ApplicantRegistrationComponent {
  currentUser: any;
  applicantId: any;
  public title: string;
  public label: string;
  public action: string;
  public setting: any;
  public registrationForm: FormGroup;
  showTeam: boolean = false;
  public yearRange: string[] = [];
  public sex: any[]=[
    {value:true, name: "Male"},
    {value:false, name: "Female"}
  ]
  regions: any;
  councils: any;
  idTypes: any;
  applicantTypes: any;
  wards: any;
  streets: any;
  actor: string;
  applicantTypeId: any;
  organizations: any;
  applicationTypeId: any;
  selectedValue: any[] = [
{code: 1, name: "INDIVIDUAL"},
{code: 1, name: "COMPANY"}
];
  name: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _commonSvc: CommonService,
    private dialogRef: MatDialogRef<ApplicantRegistrationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
console.log("Passed Data", data.item);
    this.title = data.title;
    this.label = data.label;
    this.action = data.action;

//Getting applicant Id
   this.currentUser = JSON.parse(localStorage.getItem('userInfo'));
   this.applicantId = this.currentUser?.data.uuid;
   console.log("Logged in User", this.applicantId);

//Getting Organizations
    this._commonSvc.getComConfigTpyes("ORGANIZATION_TYPE")
      .subscribe((response) => {
        if (response.code === 6000) {
          console.log("OrganizationType", response.data);
          for (let i = 0; i < response.data?.length; i++) {
            if (response.data[i].name === "INSTITUTION") {
              this.applicationTypeId = response.data[i]?.setupUUID;
            }
          }
console.log("ApplicationTypeId",this.applicationTypeId);
   this.fetchAllOrganizations(this.applicationTypeId);
        }
      });
  }

  ngOnInit() {
    this.getAllRegions();
   this.getAllRegions();
this.fetchAllIdTypes();
this.fetchAllApplicantTypes();
    this.registrationForm = this.initForm();
    //this.populateYearRange(2023, 2050);
  }

  // populateYearRange(startYear: number, endYear: number): void {
  //   for (let year = startYear; year <= endYear; year++) {
  //     this.yearRange.push(`${year}/${year + 1}`);
  //   }
  //     console.log(this.yearRange);
  // }

  selectedOption(item){
    console.log("On change List",item);
   this.actor = item.name;
 }
onIdChange(item:any){
if(item.name === 'nida'|| item.name === 'NIDA'){
 this.name =true; 
}else{
this.name = false
}

}
  initForm():FormGroup{
    return this.formBuilder.group({
  applicantTypeId: ['',Validators.required],
  firstName: ['', ],
  middleName:['', ],
  lastName: ['', ],
  companyName: ['', ],
  username: ['',],
  identificationCardTypeId:['', Validators.required],
  idNumber:['', Validators.required],
  address: ['', Validators.required],
  regionId: ['', Validators.required],
  councilCode: ['', Validators.required],
  wardCode: ['', Validators.required],
  streetId: ['', Validators.required],
  mobileNumber:['', Validators.required],
  email: ['', Validators.email],
  sex: ['', ],
  title: ['', ],
  password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
  confirmPassword: [Validators.required]
  });
  }

passwordMissMatch(item:any){
if(item.password !== item.confirmPassword){
return Swal.fire("Sorry!", "Password MissMatch!", "error");
}else{
return ""
}
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
     this.registrationForm.get('idNumber').setValue(formattedValue); 
  }

  formatTin(event: any) {
    const value = event.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{3})(?=\d)/g, "$1-");
    event.target.value = formattedValue;
    this.registrationForm.get("idNumber").setValue(formattedValue);
  }

  formatPhoneNumber(event: any) {
    const value = event.target.value.replace(/\D/g, "");
    event.target.value = value;
    this.registrationForm.get("mobileNumber").setValue(value);
  }

  public fetchAllOrganizations(id:any){
    this._commonSvc.fetchAllOrganizations(id).subscribe((response) => {
       console.log("Organizations", response);
      if(response.code === 6000){

        this.organizations = response.data
        
      }
    });
  }
  public fetchAllIdTypes() {
    this._commonSvc.getAllIdTypes().subscribe((response) => {
      console.log("idTypes", response);
      if (response.code === 6000) {
        this.idTypes = response.data;
      }
    });
  }
  public fetchAllApplicantTypes() {
    this._commonSvc.getAllApplicantTypes().subscribe((response) => {
      console.log("aPPLICANT tYPE", response);
      if (response.code === 6000) {
        this.applicantTypes = response.data;
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

  onChange(item: any) {

     console.log("On Changes Regions", item);
    this._commonSvc.getCouncilByRegionCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
          console.log("councilsss", this.councils);
        } 
      }
    });
  }

  onChangeCouncil(item: any) {
    this._commonSvc.getWardByCouncilCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.wards = response.data;
          console.log("wards", this.wards);
        } 
      }
    });
  }
  onChangeWard(item: any) {
    this._commonSvc.getStreetByWardCode(item.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.streets = response.data;
          console.log("streets", this.streets);
        } 
      }
    });
  }

  getCouncilByRegionCode(event: any) {
    this._commonSvc.getCouncilByRegionCode(event.value.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
          console.log("councilsss", this.councils);
        } 
      }
    });
  }

  getStreetByWardCode(event: any) {
    this._commonSvc.getStreetByWardCode(event.value.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.councils = response.data;
          console.log("councilsss", this.councils);
        } 
      }
    });
  }

  saveApplicant(item:any) {
   this.passwordMissMatch(item);
   localStorage.clear();
   if(this.actor === ""){
    this.actor = "Company";
   }
    console.log("Form Submitted", item);
  let payload = {
  applicantTypeId: item.applicantTypeId,
  firstName: item.firstName,
  middleName:  item.middleName,
  lastName:  item.lastName,
  username:  item.email,
  identificationCardTypeId:  item.identificationCardTypeId,
  companyName: item.companyName,
  identificationCardNumber: item.idNumber,
  address: item.address,
  streetCode: item.streetId,
  phoneNumber: item.mobileNumber,
  email: item.email,
  sex: item.sex,
  title: "",
  password:item.password,
  confirmPassword: item.confirmPassword,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  enabled: true,
  newAccount: true,
  organizationId: ""
}

  console.log("Payload to Save", payload);
   
  this._commonSvc.saveApplicant(payload).subscribe((response)=>{
    console.log("Applicant Saved Response", response);
        if (response.code === 6000) {
             this.dialogRef.close(response);
        }else{
          this.dialogRef.close(response);
        }
  })

  }

}

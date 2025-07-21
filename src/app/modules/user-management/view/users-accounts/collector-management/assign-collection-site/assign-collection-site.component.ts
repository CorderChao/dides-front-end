import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CollectorService } from "src/app/modules/user-management/collector.service";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { ToastService } from "src/app/modules/shared/services/toast.service";

@Component({
  selector: "app-assign-collection-site",
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: "./assign-collection-site.component.html",
  styleUrl: "./assign-collection-site.component.scss",
})
export class AssignCollectionSiteComponent {
  public title: string;
  public label: string;
  public action: string;
  public assignCollectionSiteForm: FormGroup;
  public collectionSiteLists: any[] = [];
  public CouncilcollectionSites: any[] = [];
  selectedCollectionSites: any[] = [];
  collector: any;
  agent: any;
  regions: any[] = [];
  councils: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AssignCollectionSiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private collectorService: CollectorService,
    private toastSvc: ToastService
  ) {
    this.title = data.title;
    this.label = data.label;
    this.action = data.action;
    this.collector = data.item;
    this.agent = JSON.parse(localStorage.getItem("userInfo"));
  }

  ngOnInit() {
    this.assignCollectionSiteForm = this.initForm();
    this.getCollectionSites();
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      selectedSite: ["", Validators.required],
      regionName: ["", Validators.required],
      councilName: ["", Validators.required],
    });
  }

  addSite() {
    const selectedSite =
      this.assignCollectionSiteForm.get("selectedSite").value;
    console.log("Selected:", selectedSite);
    this.selectedCollectionSites = [];
    if (selectedSite && !this.selectedCollectionSites.includes(selectedSite)) {
      this.selectedCollectionSites.push(selectedSite);
      console.log("Selected:", this.selectedCollectionSites);
    }
  }

  removeDuplicates(arr, name) {
    const uniqueIds = [];
    const unique = arr.filter((element) => {
      const isDuplicate = uniqueIds.includes(element[name]);
      if (!isDuplicate) {
        uniqueIds.push(element[name]);
        return true;
      }
      return false;
    });
    return unique;
  }

  getCollectionSites() {
    this.collectorService
      .getAgentAvailableCollectionSites(this.agent.organization)
      .subscribe({
        next: (response) => {
          if (response.code === 6000) {
            this.collectionSiteLists = response.data;
            this.collectionSiteLists.forEach((e) => {
              this.regions.push(e.street.ward.council.region);
            });
            this.regions = this.removeDuplicates(this.regions, "name");
          } else if (response.code === 6004) {
            this.collectionSiteLists = [];
          } else if (response.code !== 6000 && response.code !== 6004) {
            this.collectionSiteLists = [];
          }
        },
      });
  }

  onRegionChange(region: any) {
    this.collectionSiteLists.forEach((e) => {
      this.councils = [];
      if (e.street.ward.council.region.uuid === region.uuid) {
        this.councils.push(e);
      }
    });
  }

  onCouncilChange(event: any) {
    this.CouncilcollectionSites = [];
    this.collectionSiteLists.forEach((e) => {
      if (e.street.ward.council.uuid === event.value) {
        this.CouncilcollectionSites.push(e);
      }
    });    
  }

  public assignCollectionSite() {
    let selectedSite: any[] = [];
    this.selectedCollectionSites.forEach((e) => {
      selectedSite.push(e.collectionUid);
    });
    this.collectorService
      .assignCollectionSite(this.collector.uuid, "ADD", selectedSite)
      .subscribe({
        next: (response) => {
          if (response.code === 6000) {
            this.toastSvc.success(
              "Information",
              `Collection Site Assigned Successfully`,
              5000
            );
            this.dialogRef.close(response);
          } else if (response.code !== 6000) {
            this.toastSvc.warning(
              "Error",
              `Unable to assign collection site`,
              5000
            );
            console.log(response.description);
          }
        },
      });
  }

  closeModal() {
    this.dialogRef.close();
  }
  
}

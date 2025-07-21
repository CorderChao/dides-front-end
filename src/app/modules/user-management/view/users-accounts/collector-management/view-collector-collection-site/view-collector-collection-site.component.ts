import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollectorService } from 'src/app/modules/user-management/collector.service';
import { TableDataRow } from 'src/app/modules/data-table/table-data-row';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ToastService } from 'src/app/modules/shared/services/toast.service';

@Component({
  selector: 'app-view-collector-collection-site',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './view-collector-collection-site.component.html',
  styleUrl: './view-collector-collection-site.component.scss'
})
export class ViewCollectorCollectionSiteComponent {
  public collectionSite: any;
  public collector: any;
  public title: string;
  subTitle: string = 'Collection Site Details';

  constructor(
    private dialogRef: MatDialogRef<ViewCollectorCollectionSiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private collectorService: CollectorService,
    private toastSvc: ToastService
  ) {
    this.collector = data.item;
    this.title = data.title;
    console.log(`hi`, this.collector);
    
  }

  ngOnInit(): void {
    this.getCollectorCollectionSite();
  }

  columns: TableDataRow[] = [
    { header: "No", value: "index" },
    {
      header: "Name",
      value: "name",
    },
    {
      header: "Code",
      value: "code",
    },
    {
      header: "Actions",
      value: "actions",
      class: "d-flex justify-content-center",
    },
  ];

  removeCollectionSite(collectionSite: any): void {
    this.collectorService
    .assignCollectionSite(this.collector.uuid, "REMOVE", [collectionSite.collectionUid])
    .subscribe({
      next: (response) => {
        if (response.code === 6000) {
          this.dialogRef.close(response);
          this.toastSvc.success("Information", `Collection Site Removed Successfully`, 5000);
        } else if (response.code !== 6000) {
          this.toastSvc.error("Error", `${response.description}`, 5000);
        }
      },
    });
  }
  
  getCollectorCollectionSite() {    
    this.collectorService.getCollectorCollectionSite(this.collector.uuid).subscribe({
      next: (response) => {
        if (response.code === 6000) {          
         this.collectionSite = response.data;  
        } else if (response.code === 6004) {
          this.collectionSite = {};
        } else if (response.code !== 6000 && response.code !== 6004) {
          this.toastSvc.warning("Error", "Unable to fetch data", 5000);
          this.collectionSite = {};
        }
      },
    });
  }

}

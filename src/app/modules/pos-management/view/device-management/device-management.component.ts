import { Component } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableDataRow } from "src/app/modules/data-table/table-data-row";
import { MenuAction } from "src/app/modules/shared/models/menu-action";
import { UtilityFunctionsService } from "src/app/modules/shared/services/utility-functions.service";
import { DeviceService } from "../../service/device.service";
import Swal from "sweetalert2";
import { ToastService } from "src/app/modules/shared/services/toast.service";

@Component({
  selector: "app-device-management",
  templateUrl: "./device-management.component.html",
  styleUrl: "./device-management.component.scss",
})
export class DeviceManagementComponent {
  deviceLists: any[] = [];
  payLoad: any;
  isOpen: boolean = false;
  params: any = {
    size: 1,
    page: 0,
    total: 0,
  };
  userInfo: any;
  title: string;

  constructor(
    private modal: MatDialog,
    private modalService: NgbModal,
    private utils: UtilityFunctionsService,
    private deviceService: DeviceService,
    private toastSvc: ToastService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));    
  }

  columns: TableDataRow[] = [
    { header: "No", value: "index" },
    { header: "Name", value: "deviceType.name" },
    { header: "MAC Address", value: "macAddress" },
    { header: "Serial Number", value: "serialNumber" },
    { header: "Institution", value: "organization.name" },
    { header: "Status", value: "status" },
    {
      header: "Actions",
      value: "actions",
      class: "d-flex justify-content-center",
    },
  ];

  lockUnlockDevice(device: any) {      
    if (device.recordStatusId === 1) {
      this.title = "Deactivate";
    } else if (device.recordStatusId === 2) {
      this.title = "Activate";
    }
  
    Swal.fire({
      title: `You are about to ${this.title} ${device.deviceType.name}?`,
      text: "",
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#1976D2",
      cancelButtonColor: "#d33000",
      cancelButtonText: "Cancel!",
      confirmButtonText: `Yes, ${this.title}`,
    }).then((result) => {
      if (result.isConfirmed) {
        if (device.recordStatusId === 1) {
          this.payLoad =  {
            "organizationUUID": device.organization.uuid,
            "macAddress": device.macAddress,
            "serialNumber": device.serialNumber,
            "deviceTypeUUID": device.deviceType.setupUUID,
            "recordStatusId": 2
          }
        } else if (device.recordStatusId === 2) {
           this.payLoad =  {
            "organizationUUID": device.organization.uuid,
            "macAddress": device.macAddress,
            "serialNumber": device.serialNumber,
            "deviceTypeUUID": device.deviceType.setupUUID,
            "recordStatusId": 1
          }        }
        this.deviceService.updateDevice(device.uuid, this.payLoad).subscribe({
          next: (response: any) => {
            console.log(`response`, response);
            if (response.code === 6000) {
              console.log('Update successfully');
              this.toastSvc.success("Information", `Updated Successfully`, 5000);
              this.getAgentDevices();
            } else {
              console.error('Update failed with code:', response.code);
              this.toastSvc.error("Error", `${response.description}`, 5000);
              this.getAgentDevices();
            }
          },
          error: (error: any) => {
            console.error('API call failed:', error);
          }
        });
      } else {
        console.log('User cancelled the action');
      }
    }).catch((error) => {
      console.error('Error displaying confirmation dialog:', error);
    });
  }
  
  ngOnInit(): void {
    this.getAgentDevices();
  }

  getAgentDevices() {    
    this.deviceService.getDevices(this.userInfo.organization).subscribe({
      next: (response) => {        
        if (response.code === 6000) {
          this.deviceLists = response.data;  
         } else if (response.code === 6004) {
          this.deviceLists = [];
        } else if (response.code !== 6000 && response.code !== 6004) {
          this.deviceLists = [];
        }
      },
    });
  }
}
